import { AdminService } from '@backend/admin-provider';
import { InputVerifyAdmin, OutputVerifyAdmin } from '@backend/shared-types';
import { Public } from '@backend/util';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('admin')
@Controller('/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Throttle({ default: { limit: 300, ttl: 300000 } })
  @Public()
  @ApiOkResponse({
    description: 'Verification of admin id.',
    type: OutputVerifyAdmin,
  })
  @ApiBadRequestResponse({ description: 'Bad or malformed request.' })
  @Post('/verify')
  verifyAdmin(@Body() inputVerifyAdmin: InputVerifyAdmin) {
    return this.adminService.verifyAdmin(inputVerifyAdmin);
  }
}
