import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BiReportsService } from './bi-reports.service';
import { CreateBiReportDto } from './dto/create-bi-report.dto';
import { UpdateBiReportDto } from './dto/update-bi-report.dto';

@Controller()
export class BiReportsController {
  constructor(private readonly biReportsService: BiReportsService) {}

  @Post()
  create(@Body() createBiReportDto: CreateBiReportDto) {
    return this.biReportsService.create(createBiReportDto);
  }

  @Get()
  findAll() {
    return this.biReportsService.findAll();
  }

  @Get('/reports')
  findAllReports() {
    return this.biReportsService.findAllReports();
  }

  @Get('/report/:id')
  findOne(@Param('id') id: string) {
    return this.biReportsService.findOne(+id);
  }
  
  @Get('/reportName/:report_name')
  findOnefindOneReportName(@Param('report_name') report_name: string) {
    return this.biReportsService.findOneReportName(report_name);
  }
  

  @Get('/azure')
  findAzure() {
    return this.biReportsService.azureToken();
  }
}
