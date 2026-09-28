import AccountTreeRounded from '@mui/icons-material/AccountTreeRounded';
import BoltRounded from '@mui/icons-material/BoltRounded';
import BubbleChartRounded from '@mui/icons-material/BubbleChartRounded';
import CallMergeRounded from '@mui/icons-material/CallMergeRounded';
import LowPriorityRounded from '@mui/icons-material/LowPriorityRounded';
import PinRounded from '@mui/icons-material/PinRounded';
import WavesRounded from '@mui/icons-material/WavesRounded';
import type { SvgIconComponent } from '@mui/icons-material';
import type { AlgorithmId } from '../algorithms';

export const ALGORITHM_ICONS: Record<AlgorithmId, SvgIconComponent> = {
  bubble: BubbleChartRounded,
  insertion: LowPriorityRounded,
  merge: CallMergeRounded,
  quick: BoltRounded,
  heap: AccountTreeRounded,
  radix: PinRounded,
  tidal: WavesRounded,
};
