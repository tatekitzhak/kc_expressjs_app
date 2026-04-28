import { Request, Response, NextFunction } from 'express';
import url from 'url';
import querystring from 'querystring';

interface ClientInfo {
    [key: string]: any;
    url: string;
    message: string;
}

interface CustomRequest extends Request {
    request_data?: any;
    requestInfo?: ClientInfo;
}

export const getUrlQueryParametersForClient = (req: Request, res: Response, next: NextFunction, msg: string): any => {
    const originalUrl = req.query['originalUrl'] as string; // getValuesOriginalUrl

    const full_url_path = `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                    parse_url_path = url.parse(full_url_path),
                    category_subcategory_info = querystring.parse(parse_url_path.query || ''),
                    subcategory_id = category_subcategory_info['subcategory_id'],
                    parse_url = new URL(full_url_path);

    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

     //Print the url object.
     const urlObject = {
        "Href": parse_url.href,
        "Origin": parse_url.origin,
        "Protocol": parse_url.protocol,
        "Username": parse_url.username,
        "Password": parse_url.password,
        "Host": parse_url.host,
        "Hostname": parse_url.hostname,
        "Port": parse_url.port,
        "Pathname": parse_url.pathname,
        "Search": parse_url.search,
        "SearchParams": parse_url.searchParams,
        "Hash": parse_url.hash,
        "query_params": category_subcategory_info,
        "parse_url": parse_url,
        "data": (req as CustomRequest).request_data,
    }

    const client_info: ClientInfo = {
        ...req.headers,
        url: fullUrl,
        message: msg,
        urlObject: urlObject
    };

    (req as CustomRequest).requestInfo = client_info;
    
    next();

}