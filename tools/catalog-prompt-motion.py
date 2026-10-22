"""Catalog public reference links; never fetch or reproduce prompt bodies.

Usage: python tools/catalog-prompt-motion.py --out=docs/references/prompt-motion/catalog.json
Only two public index pages are requested. No third-party dependencies.
"""

import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


class IndexParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.anchors = []
        self.anchor = None
        self.heading = None
        self.category = None
        self.visible_text = []
        self.hidden_depth = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("script", "style"):
            self.hidden_depth += 1
        if self.hidden_depth:
            return
        if tag == "h2":
            self.heading = []
        if tag == "a":
            self.anchor = {"href": attrs.get("href", ""), "text": [], "category": self.category}

    def handle_data(self, data):
        if self.hidden_depth:
            return
        self.visible_text.append(data)
        if self.heading is not None:
            self.heading.append(data)
        if self.anchor is not None:
            self.anchor["text"].append(data)

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.hidden_depth = max(0, self.hidden_depth - 1)
            return
        if self.hidden_depth:
            return
        if tag == "h2" and self.heading is not None:
            self.category = re.sub(r"\s*\d+\s*$", "", " ".join(self.heading)).strip()
            self.heading = None
        if tag == "a" and self.anchor is not None:
            self.anchors.append(self.anchor)
            self.anchor = None


def build_catalog():
    entries = {}
    sources = []
    for name, url in [("library", "https://promptmotion.org/prompts"), ("gallery", "https://promptmotion.org/")]:
        request = Request(url, headers={"User-Agent": "PersonalVideoEngine-reference-catalog/1.0"})
        with urlopen(request, timeout=60) as response:
            raw = response.read()
        parser = IndexParser()
        parser.feed(raw.decode("utf-8"))
        visible = " ".join(parser.visible_text)
        advertised = re.search(r"([\d,]+)\s+Claude motion design prompts", visible)
        found = set()
        matched_links = 0
        unmatched_prompt_paths = set()
        for anchor in parser.anchors:
            parsed = urlparse(urljoin(url, anchor["href"]))
            if parsed.hostname not in ("promptmotion.org", "www.promptmotion.org"):
                continue
            # The library uses /prompts/p-<8 hex>; the film gallery uses
            # /<creator>-<6 hex>. Both are observed public entry formats.
            if not re.fullmatch(r"/(?:prompts/p-[a-f0-9]{8}(?:-\d+)?|[a-z0-9][a-z0-9-]*-[a-f0-9]{6})/?", parsed.path):
                if parsed.path.startswith("/prompts/p-"):
                    unmatched_prompt_paths.add(parsed.path)
                continue
            matched_links += 1
            entry_id = parsed.path.strip("/")
            entry = entries.setdefault(entry_id, {
                "id": entry_id,
                "url": f"https://promptmotion.org/{entry_id}",
                "creators": [], "categories": [], "indexes": [],
                "promptTextStatus": "not-copied",
            })
            # Parse attribution/category metadata only. Discard anchor titles.
            text = " ".join(anchor["text"])
            # Titles can mention other handles; index attribution is last.
            # Gallery anchors include attribution. Library anchor titles do not:
            # an @mention there can name someone other than the creator.
            handles = re.findall(r"@([A-Za-z0-9_]+)", text) if name == "gallery" else []
            creator = handles[-1] if handles else None
            if creator and creator not in entry["creators"]:
                entry["creators"].append(creator)
            if name == "library" and anchor["category"] and anchor["category"] not in entry["categories"]:
                entry["categories"].append(anchor["category"])
            if name not in entry["indexes"]:
                entry["indexes"].append(name)
            found.add(entry_id)
        if not found:
            raise RuntimeError(f"No entry links found in {url}; inspect the index before changing its parser")
        sources.append({
            "id": name, "url": url, "indexedEntries": len(found),
            "matchedEntryLinks": matched_links,
            "repeatedEntryLinks": matched_links - len(found),
            "unrecognizedPromptPaths": sorted(unmatched_prompt_paths),
            "advertisedEntries": int(advertised[1].replace(",", "")) if advertised else None,
            "pageSha256": hashlib.sha256(raw).hexdigest(),
        })
    return {
        "version": 1,
        "retrievedAt": datetime.now(timezone.utc).isoformat(),
        "scope": "Public entry-link metadata from two index pages. No prompt bodies, thumbnails or videos copied.",
        "sources": sources,
        "entryCount": len(entries),
        "entries": sorted(entries.values(), key=lambda entry: entry["id"]),
    }


def render_links(catalog):
    lines = [
        "# Prompt Motion reference links", "",
        f"Snapshot: {catalog['retrievedAt']}. Distinct source URLs: {catalog['entryCount']}.", "",
        "Identifiers and attribution metadata only; prompt bodies are not copied.",
        "Library/gallery aliases are not deduplicated by prompt content.", "",
    ]
    groups = {}
    for entry in catalog["entries"]:
        group = entry["categories"][0] if entry["categories"] else "Film gallery"
        groups.setdefault(group, []).append(entry)
    for category, entries in sorted(groups.items()):
        lines.extend([f"## {category} ({len(entries)})", ""])
        for entry in entries:
            creators = ", ".join(f"@{handle}" for handle in entry["creators"]) or "check original credit"
            lines.append(f"- [{entry['id']}]({entry['url']}) — {creators}")
        lines.append("")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, help="New JSON output path; existing files are refused")
    parser.add_argument("--links-out", help="Optional new Markdown link-list path")
    args = parser.parse_args()
    output = Path(args.out)
    if output.exists():
        raise FileExistsError(f"Output exists; select a new snapshot path: {output}")
    links_output = Path(args.links_out) if args.links_out else None
    if links_output and (links_output.exists() or links_output.resolve() == output.resolve()):
        raise FileExistsError("Link-list output must be new and distinct from JSON output")
    catalog = build_catalog()
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("x", encoding="utf-8") as target:
        json.dump(catalog, target, ensure_ascii=False, indent=2)
        target.write("\n")
    if links_output:
        links_output.parent.mkdir(parents=True, exist_ok=True)
        with links_output.open("x", encoding="utf-8") as target:
            target.write(render_links(catalog))
    print(json.dumps({"output": str(output), "entries": catalog["entryCount"], "sources": catalog["sources"]}, indent=2))


if __name__ == "__main__":
    main()
