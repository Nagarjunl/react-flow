import type { QueryParamsType } from "../Dto/formDto";

export function ValidateParams(fromparams: QueryParamsType) {
    const params: any = {};
    params["pageNumber"] = fromparams?.PageNumber?.toString();
    params["pageSize"] = fromparams?.PageSize?.toString();
    if (fromparams?.OrderBy) params["orderBy"] = fromparams?.OrderBy;
    if (fromparams?.SearchTerm && fromparams.SearchTerm.trim().length > 0)
        params["SearchTerm"] = fromparams?.SearchTerm;
    if (fromparams?.IsActive !== null && fromparams?.IsActive !== undefined)
        params["IsActive"] = fromparams?.IsActive;
    if (fromparams?.startDate)
        params["startDate"] = fromparams?.startDate?.toString();
    if (fromparams?.endDate)
        params["endDate"] = fromparams?.endDate?.toString();
    if (fromparams?.Category)
        params["category"] = fromparams?.Category?.toString();
    if (fromparams?.Status)
        params["Status"] = fromparams?.Status?.toString();
    return params
}






