import { Request, Response } from 'express';

export interface CustomRequest extends Request {
    user?: any; // Extend with user information if needed
}

export interface CustomResponse extends Response {
    sendSuccess: (data: any) => Response;
    sendError: (error: any) => Response;
}

// Add more interfaces as needed