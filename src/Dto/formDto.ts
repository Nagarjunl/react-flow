export interface QueryParamsType {
    Category?: number | null | string;
    OrderBy?: string;
    SearchTerm?: string;
    PageNumber?: number;
    PageSize?: number;
    startDate?: string;
    endDate?: string;
    IsActive?: string | boolean | null;
    Status?: string | number;
}

export interface OptionType {
    id?: string | number;
    value?: string | number | boolean;
    name?:string
}
type AllowedType =
    | "pdf"
    | "image"
    | "word"
    | "excel"
    | "ppt"
    | "text"
    | "csv"
    | "zip"
    | "video"
    | "audio"
    | "all";
export interface FormFieldProps<T> {
    valueName?: string;
    allowFile?: AllowedType[];
    label?: string;
    tooltip?: string;
    type?:
    | "text"
    | "number"
    | "password"
    | "select"
    | "checkbox"
    | "radio"
    | "autocomplete"
    | "D&DUpload"
    | "date"
 
    | "datetime-local"
  
    | "autocompletemultiple"
    | "D&DUploadImage"
    | "skipDates";

    skipDates?: Array<{ startDate: string; endDate: string }>;

    baseurl?: string;
    name: string;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    hide?: boolean;
    variant?: "standard" | "filled" | "outlined";
    options?: OptionType[];
    multiple?: boolean;
    placeholder?: string;
    style?: React.CSSProperties;
    renderComponent?: (props: any) => React.ReactNode;
    Params?: QueryParamsType;
    error?: string;
    size?: { sm: number; md: number; lg: number };
    inputsize?: "small" | "medium";
    optionLabel?: (e: any, i: number) => string;
    autocompletelabel?: {
        optionlable?: string;
        optionvalue?: { id: string; value?: string };
    };
    value?: T;
    onChange?: (val: string | number | boolean) => void;
    group?: FormFieldProps<T>[];
    startInput?: React.ReactNode;
    endInput?: React.ReactNode;
    min?: string;
    max?: string;
    IsAll?: boolean;
    excludeValues?: string[];
}
