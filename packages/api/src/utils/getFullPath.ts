import { Request } from 'express';

const getFullPath = (req: Request, path: string) => `${req.protocol}://${req.get('host')}/${path}`

export default getFullPath;