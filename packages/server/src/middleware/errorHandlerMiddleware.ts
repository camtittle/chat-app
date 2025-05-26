import { ErrorRequestHandler } from "express"
import { ZodError } from "zod"

export const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack)
  console.log(err)
  console.log(err.stack)
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation error',
      issues: err.issues,
    })
    return
  }

  res.status(500).send('Internal error')
}