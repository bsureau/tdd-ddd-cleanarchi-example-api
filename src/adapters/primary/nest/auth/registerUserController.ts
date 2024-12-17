import { Body, Controller, Post, Res } from '@nestjs/common';
import {
    RegisterUserRequest,
    RegisterUserUseCase,
} from '@core-logic/auth/usecases/registerUserUseCase';
import { ErrorCodes } from '@core-logic/shared/models/errors';

@Controller('register')
export class RegisterUserController {
    constructor(private readonly registerUser: RegisterUserUseCase) {}

    @Post()
    async execute(
        @Body() registerUserRequest: RegisterUserRequest,
        @Res() response
    ): Promise<any> {
        const registerUserResponse =
            await this.registerUser.execute(registerUserRequest);

        return response
            .status(
                registerUserResponse.success
                    ? 201
                    : registerUserResponse.error ===
                        ErrorCodes.EMAIL_ADDRESS_ALREADY_IN_USE
                      ? 409
                      : 400
            )
            .json(registerUserResponse);
    }
}
