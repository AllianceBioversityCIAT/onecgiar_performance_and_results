import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  HttpException,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { HeadersDto } from '../../shared/globalInterfaces/headers.dto';
import { TokenDto } from '../../shared/globalInterfaces/token.dto';
import { MapLegacy } from './dto/map-legacy.dto';

@Controller()
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post('create/header')
  async create(
    @Body() createResultDto: CreateResultDto,
    @Headers() auth: HeadersDto,
  ) {
    const token: TokenDto = <TokenDto>(
      JSON.parse(Buffer.from(auth.auth.split('.')[1], 'base64').toString())
    );
    const { message, response, status } =
      await this.resultsService.createOwnerResult(createResultDto, token);
    throw new HttpException({ message, response }, status);
  }

  @Get('get/name/:name')
  findAll(@Param('name') resultName: string) {
    return this.resultsService.findAll() + resultName;
  }

  // * Get all results
  @Get('get/all')
  async findAllResults() {
    const { message, response, status } = await this.resultsService.findAll();
    throw new HttpException({ message, response }, status);
  }

  @Get('get/initiatives/:userId')
  findInitiativesByUser(@Param('userId') userId: number) {
    return `aja ${userId}`;
  }

  // * Get all results-roles by user ID
  @Get('get/all/roles/:userId')
  async findAllResultRoles(@Param('userId') userId: number) {
    const { message, response, status } =
      await this.resultsService.findAllByRole(userId);
    throw new HttpException({ message, response }, status);
  }

  @Get('get/depth-search/:title')
  async depthSearch(@Param('title') title: string) {
    const { message, response, status } = 
      await this.resultsService.findAllResultsLegacyNew(title);
    throw new HttpException({ message, response }, status);
  }

  @Post('map/legacy')
  async mapResultLegacy(
    @Body() MapLegacy: MapLegacy,
    @Headers() auth: HeadersDto,
  ){
    const token: TokenDto = <TokenDto>(
      JSON.parse(Buffer.from(auth.auth.split('.')[1], 'base64').toString())
    );
    const { message, response, status } = 
      await this.resultsService.mapResultLegacy(MapLegacy, token);
    throw new HttpException({ message, response }, status);
  }

  @Patch('delete/:id')
  async update(@Param('id') id: number) {
    console.log(id);
    const { message, response, status } =
      await this.resultsService.deleteResult(id);
    throw new HttpException({ message, response }, status);
  }
}
