import {Composition} from 'remotion';
import type {Brief} from './brief';
import {totalFrames} from './brief';
import {Video} from './video';
import demo from '../briefs/demo.json';

const defaultBrief = demo as Brief;

export const Root = () => (
  <Composition
    id="BrandStory"
    component={Video}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={totalFrames(defaultBrief)}
    defaultProps={defaultBrief}
    calculateMetadata={({props}) => ({
      width: props.format === 'landscape' ? 1920 : 1080,
      height: props.format === 'landscape' ? 1080 : 1920,
      durationInFrames: totalFrames(props),
    })}
  />
);
