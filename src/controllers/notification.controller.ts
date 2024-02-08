import HTTP from "http-status-codes";

import NotificationService from "../services/notification.service";
import { IRequest, IResponse, INextFunction, IGetNotification, INotification, IPaginationNotification, IQueryNotification } from "../helpers/interface.helper";
import { NOTIFICATION_RESPONSE } from "../constants/response.constant";

const notificationController = {
	getManyNotification: async (req: IRequest, res: IResponse, next: INextFunction) => {
		try {
			const { seen, search, skip = 0, limit = 10 } = req.body;
			let findQuery: IQueryNotification = {
				user: req.decoded.id,
				seen: false,
			};
			if (seen) {
				findQuery.seen = seen;
			}
			if (search) {
				findQuery = {
					...findQuery,
					$or: [
						{ title: { $regex: search, $options: "i" } },
						{ body: { $regex: search, $options: "i" } },
						{ "merge_fields.USERNAME": { $regex: search, $options: "i" } },
					],
				};
			}
			const getManyNotification = await NotificationService.getManyNotificationWithPagination(findQuery, { skip, limit });
			const notifications = NotificationService.mergeNotifications(getManyNotification.docs);
			const result: IPaginationNotification = {
				docs: notifications,
				...getManyNotification,
			};
			res.send({
				status: NOTIFICATION_RESPONSE.SUCCESS,
				message: NOTIFICATION_RESPONSE.GET_MANY_SUCCESS,
				data: result,
			});
		} catch (err) {
			err.desc = NOTIFICATION_RESPONSE.GET_MANY_FAILED;
			next(err);
		}
	},

	notificationSeen: async (req: IRequest, res: IResponse, next: INextFunction) => {
		try {
			const updateQuery: IGetNotification = {
				user: req.decoded.id,
				_id: req.body.notification_id,
			};
			const updateBody: INotification = {
				seen: true,
			};
			const editNotification = await NotificationService.editNotification(updateQuery, updateBody);
			if (editNotification) {
				res.send({
					status: NOTIFICATION_RESPONSE.SUCCESS,
					message: NOTIFICATION_RESPONSE.UPDATED,
				});
			} else {
				res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: NOTIFICATION_RESPONSE.FAILED, message: NOTIFICATION_RESPONSE.UPDATE_FAILED });
			}
		} catch (err) {
			err.desc = NOTIFICATION_RESPONSE.UPDATE_FAILED;
			next(err);
		}
	},
};

export default notificationController;
