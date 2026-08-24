// src/middleware/validateResource.ts
import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";

export const validate = (schema: ZodType) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Validasi body, query, dan params sekaligus
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			// Jika hanya ingin validasi body saja, gunakan ini:
			// await schema.parseAsync(req.body);

			next(); // Lanjut ke Controller jika valid
		} catch (error) {
			if (error instanceof ZodError) {
				// Memformat error Zod menjadi lebih rapi per field
				const formattedErrors = error.issues.map((issue) => ({
					// issue.path array terlihat seperti: ['body', 'password']
					// Kita ambil elemen terakhir agar pesannya fokus ke nama field-nya saja
					field: issue.path[issue.path.length - 1],
					message: issue.message,
				}));

				// Langsung kembalikan response 400 Bad Request tanpa masuk ke global handler
				return res.status(400).json({
					status: "error",
					message: "Data tidak valid",
					errors: formattedErrors,
				});
			}

			// Jika errornya bukan dari Zod, oper ke Global Error Handler
			next(error);
		}
	};
};
