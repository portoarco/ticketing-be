import { Request, Response, NextFunction } from "express";

class OrganizerController {
  public async organizerById(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

export default OrganizerController;
