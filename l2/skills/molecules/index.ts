/// <mls fileReference="_102020_/l2/skills/molecules/index" enhancement="_blank"/>


export const skills = [
    // Category 1: Data Entry & Editing
    {
        name: 'groupSelectOne',
        description: 'Allows the user to select exactly one option from a list of mutually exclusive choices. Ideal for scenarios where a single, clear decision is required. Implementations include dropdown, radio group, segmented control, knob, and list picker.',
        skillReference: '/_102020_/l2/skills/molecules/groupSelectOne/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupSelectOne/usage',
    },
    {
        name: 'groupSelectMany',
        description: 'Allows the user to select one or more options from a list. Ideal for building collections, applying multiple filters, or choosing several items simultaneously. Implementations include checkbox group, tags/chips, dual list, and multi-select dropdown.',
        skillReference: '/_102020_/l2/skills/molecules/groupSelectMany',
        skillUsageReference: ''
    },
    {
        name: 'groupEnterText',
        description: 'Allows the user to input free-form text. Ideal for names, descriptions, comments, emails, passwords, and any textual data. Implementations include input, textarea, password input, masked input, input OTP, search input, and tag input.',
        skillReference: '/_102020_/l2/skills/molecules/groupEnterText/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupEnterText/usage'
    },

    {
        name: 'groupEnterNumber',
        description: 'Allows the user to input numeric values. Ideal for quantities, measurements, percentages, ages, weights, and numeric configurations. Implementations include number input, stepper, slider, percentage input, and quantity selector.',
        skillReference: '/_102020_/l2/skills/molecules/groupEnterNumber/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupEnterNumber/usage',
    },
    {
        name: 'groupEnterMoney',
        description: 'Allows the user to input monetary values with locale-aware formatting. Ideal for prices, payments, budgets, and financial transactions. Handles currency symbols, thousand separators, and decimal precision. Implementations include currency input, price field, money input, and currency converter.',
        skillReference: '/_102020_/l2/skills/molecules/groupEnterMoney/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupEnterMoney/usage',
    },
    {
        name: 'groupEnterDatetime',
        description: 'Allows the user to input date and/or time values. Ideal for scheduling, deadlines, date ranges, and appointments. Implementations include date picker, time picker, datetime picker, date range picker, inline calendar, month picker, and year picker.',
        skillReference: '/_102020_/l2/skills/molecules/groupEnterDateTime/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupEnterDateTime/usage'
    },

    {
        name: 'groupEnterDate',
        description: 'Allows the user to input a date only (no time). Ideal for birth dates, due dates, contract effective dates, expiration dates, and any scenario where the time of day is irrelevant. Implementations include date picker, masked date input, inline calendar, and month/year picker.',
        skillReference: '/_102020_/l2/skills/molecules/groupEnterDate/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupEnterDate/usage'
    },
    {
        name: 'groupEnterTime',
        description: 'Allows the user to input a time only (no date). Ideal for business hours, recurring daily schedules, alarm times, opening and closing times, and shift configurations. Implementations include time picker with scrollable columns, masked time input, time spinner, and clock face.',
        skillReference: '/_102020_/l2/skills/molecules/groupEnterTime/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupEnterTime/usage'
    },
    {
        name: 'groupEnterDateInterval',
        description: 'Allows the user to input a date range with a start date and an end date (no time). Ideal for vacation periods, report filters, campaign durations, contract validity, and hotel or flight booking dates. Implementations include date range picker with dual calendar, inline date range, and range picker with presets.',
        skillReference: '/_102020_/l2/skills/molecules/groupEnterDateInterval/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupEnterDateInterval/usage'
    },
    {
        name: 'groupEnterDateTimeInterval',
        description: 'Allows the user to input a date+time range with a start datetime and an end datetime. Ideal for meeting scheduling, room reservations, maintenance windows, task time tracking, and any booking that requires exact start and end timestamps. Implementations include datetime range picker, event scheduler, and booking widget.',
        skillReference: '/_102020_/l2/skills/molecules/groupEnterDateTimeInterval/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupEnterDateTimeInterval/usage'
    },
    {
        name: 'groupEnterTimeInterval',
        description: 'Allows the user to input a time range with a start time and an end time (no date). Ideal for work shifts, business hours configuration, recurring availability windows, class schedules, and break intervals. Supports overnight intervals that cross midnight. Implementations include time range picker, dual-handle timeline slider, and business hours grid.',
        skillReference: '/_102020_/l2/skills/molecules/groupEnterTimeInterval/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupEnterTimeInterval/usage'
    },
    {
        name: 'groupLocatePosition',
        description: 'Allows the user to inform or visualize a geographic location. Supports address search with autocomplete (suggestions provided by the page via BFF), geolocation capture, and map preview. Value is stored as a JSON string containing lat, lng, and address. Implementations include address autocomplete, map picker, geolocation button, and area selector.',
        skillReference: '/_102020_/l2/skills/molecules/groupLocatePosition/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupLocatePosition/usage'
    },

    {
        name: 'groupSelectFileForUpload',
        description: 'Allows the user to select one or more files to be uploaded. Stateless — emits selected File objects via change event; the page is responsible for uploading via BFF. Supports drag-and-drop, file type and size validation, and emits a reject event for invalid files. Implementations include drag-drop zone, file button, multi-file upload, camera capture, and paste from clipboard.',
        skillReference: '/_102020_/l2/skills/molecules/groupSelectFileForUpload/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupSelectFileForUpload/usage'
    },

    {
        name: 'groupShowProgress',
        description: 'Indicates the progress of an operation or process. Visual primitive designed for composition inside other components. Supports determinate mode (0-100%) and indeterminate mode (unknown duration). Implementations include progress bar, progress ring/circle, spinner, and percentage indicator.',
        skillReference: '/_102020_/l2/skills/molecules/groupShowProgress/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupShowProgress/usage'
    },
    {
        name: 'groupRateItem',
        description: 'Allows the user to rate or score an item. Supports auto-generated options from a numeric range (min/max/step) or custom options via Item slot tags (emoji, icons, text). Value is always a number. Implementations include star rating, thumbs up/down, emoji rating, NPS scale, and satisfaction slider.',
        skillReference: '/_102020_/l2/skills/molecules/groupRateItem/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupRateItem/usage'
    },
    {
        name: 'groupViewChart',
        description: 'Displays data through graphical representation. Data provided via Series and Point slot tags. All chart implementations share the same data contract — swap the component tag to change visualization. Supports multi-series (Line, Bar, Area, Radar, Scatter) and single-series (Pie, Donut, Funnel). Implementations include bar chart, line chart, area chart, pie chart, donut chart, scatter chart, radar chart, and funnel chart.',
        skillReference: '/_102020_/l2/skills/molecules/groupViewChart/creation',
        skillUsageReference: '/_102020_/l2/skills/molecules/groupViewChart/usage'
    },










    {
        name: 'groupViewData',
        description: 'Display a collection of data with adaptive layout. The component decides the best presentation based on context (viewport, configuration). Use when displaying multiple records with defined fields and rich content.',
        skillReference: '/_102020_/l2/skills/molecules/groupViewData',
        skillUsageReference: ''
    },
    {
        name: 'groupViewTable',
        description: 'Displays and allows interaction with structured tabular data. Supports sorting, filtering, pagination, selection, and inline editing. Ideal for lists of records, data comparison, bulk operations, and CRUD interfaces. Implementations include table, editable grid, virtualized table, tree table, and pivot table.',
        skillReference: '/_102020_/l2/skills/molecules/groupViewTable',
        skillUsageReference: ''
    },

    {
        name: 'groupNotifyUser',
        description: 'Informs the user about events, status changes, or action results. Ideal for success/error feedback, system alerts, and important announcements. Implementations include toast, snackbar, banner, alert, and notification card.',
        skillReference: '/_102020_/l2/skills/molecules/groupNotifyUser',
        skillUsageReference: ''
    }

]