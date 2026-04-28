import { HealthIndicator, ResourceHealth } from './health-indicator.js'
import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

//  some-service.check.ts
export class SomeServiceCheck extends HealthIndicator {
    name: string = 'Some Service';
  
    async checkHealth(): Promise<void> {
      let result: AxiosResponse<any>;
      try {
        const pingURL = `https://jsonplaceholder.typicode.com/users`;
        result = await axios(pingURL);
  
        if (result.status === 200) {
          this.status = ResourceHealth.Healthy;
        } else {
          this.status = ResourceHealth.Unhealthy;
          this.details = `Received status: ${result.status}`;
        }
      } catch (error: any) {
        this.status = ResourceHealth.Unhealthy;
        this.details = error.message;
        console.log(`HEALTH: ${this.name} is unhealthy.`, error.message);
      }
    }
  }
  