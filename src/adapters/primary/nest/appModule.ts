import { Module } from '@nestjs/common';
import { AuthModule } from '@adapters/primary/nest/auth/authModule';

@Module({
    imports: [AuthModule],
})
export class AppModule {}
