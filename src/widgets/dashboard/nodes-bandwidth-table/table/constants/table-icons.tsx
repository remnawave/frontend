/* eslint-disable camelcase */
import {
    PiArrowsDownUp,
    PiArrowsIn,
    PiArrowsInLineHorizontal,
    PiArrowsOut,
    PiCaretCircleLeft,
    PiCaretCircleRight,
    PiCaretDoubleDown,
    PiCaretDown,
    PiCaretLeft,
    PiCaretRight,
    PiColumns,
    PiDotsThree,
    PiDotsThreeVertical,
    PiEraser,
    PiEyeSlash,
    PiFloppyDisk,
    PiFunnel,
    PiFunnelSimple,
    PiMagnifyingGlass,
    PiPencilSimple,
    PiPushPin,
    PiPushPinSlash,
    PiSortAscending,
    PiSortDescending,
    PiSquaresFour,
    PiTextIndent,
    PiX,
    PiXCircle
} from 'react-icons/pi'
import { MRT_Icons } from 'mantine-react-table'
import { IconBaseProps } from 'react-icons/lib'
import { JSX } from 'react/jsx-runtime'

export const customIcons: Partial<MRT_Icons> = {
    IconArrowAutofitContent: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiArrowsInLineHorizontal {...props} />
    ),
    IconArrowsSort: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiArrowsDownUp {...props} />
    ),
    IconBaselineDensityLarge: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiTextIndent {...props} />
    ),
    IconBaselineDensityMedium: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiTextIndent {...props} />
    ),
    IconBaselineDensitySmall: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiTextIndent {...props} />
    ),
    IconBoxMultiple: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiSquaresFour {...props} />
    ),
    IconChevronDown: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiCaretDown {...props} />,
    IconChevronLeft: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiCaretLeft {...props} />,
    IconChevronLeftPipe: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiCaretCircleLeft {...props} />
    ),
    IconChevronRight: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiCaretRight {...props} />
    ),
    IconChevronRightPipe: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiCaretCircleRight {...props} />
    ),
    IconChevronsDown: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiCaretDoubleDown {...props} />
    ),
    IconCircleX: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiXCircle {...props} />,
    IconClearAll: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiEraser {...props} />,
    IconColumns: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiColumns {...props} />,
    IconDeviceFloppy: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiFloppyDisk {...props} />
    ),
    IconDots: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiDotsThree {...props} />,
    IconDotsVertical: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiDotsThreeVertical {...props} />
    ),
    IconEdit: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiPencilSimple {...props} />,
    IconEyeOff: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiEyeSlash {...props} />,
    IconFilter: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiFunnel {...props} />,
    IconFilterCog: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiFunnelSimple {...props} />
    ),
    IconFilterOff: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiFunnelSimple {...props} />
    ),
    IconGripHorizontal: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiDotsThreeVertical {...props} />
    ),
    IconMaximize: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiArrowsOut {...props} />,
    IconMinimize: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiArrowsIn {...props} />,
    IconPinned: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiPushPin {...props} />,
    IconPinnedOff: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiPushPinSlash {...props} />
    ),
    IconSearch: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiMagnifyingGlass {...props} />
    ),
    IconSearchOff: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiMagnifyingGlass {...props} />
    ),
    IconSortAscending: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiSortAscending {...props} />
    ),
    IconSortDescending: (props: IconBaseProps & JSX.IntrinsicAttributes) => (
        <PiSortDescending {...props} />
    ),
    IconX: (props: IconBaseProps & JSX.IntrinsicAttributes) => <PiX {...props} />
}
