import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";

export const Backdrop: React.FC<React.PropsWithChildren> = ({children}) => {
  const frame = useCurrentFrame();
  const glowX = interpolate(frame, [0, 540], [18, 78]);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        color: "#f8fbff",
        background:
          "radial-gradient(circle at 18% 12%, #123a52 0, #081522 35%, #050b15 78%)",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.17,
          backgroundImage:
            "linear-gradient(rgba(130,220,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(130,220,255,.18) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          transform:
            "perspective(900px) rotateX(58deg) scale(1.5) translateY(210px)",
          transformOrigin: "center bottom",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          borderRadius: "50%",
          left: `${glowX}%`,
          top: "-32%",
          transform: "translateX(-50%)",
          background: "#21d4fd",
          filter: "blur(150px)",
          opacity: 0.16,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
