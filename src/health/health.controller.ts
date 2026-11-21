import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  type HealthCheckResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([() => this.database.pingCheck('database')]);
  }
}
