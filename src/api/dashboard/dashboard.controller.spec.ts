import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { CommonFunctionService } from 'src/common/helper/common-function.services';
import { DashboardController } from './dashboard.controller';
describe('DashboardController', () => {
  let pipe: DashboardController;
  beforeEach(async () => {
    const httpServiceStub = { get: url1 => ({ subscribe: () => ({}) }) };
    const commonFunctionServiceStub = {
      sendResSuccessV2: (data1, res2) => ({}),
      sendResErrorV3: (err1, res2) => ({})
    };
    const module = await Test.createTestingModule({
      providers: [
        DashboardController,
        { provide: HttpService, useValue: httpServiceStub },
        { provide: CommonFunctionService, useValue: commonFunctionServiceStub }
      ]
    }).compile();
    pipe = await module.get<DashboardController>(DashboardController);
  });
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});