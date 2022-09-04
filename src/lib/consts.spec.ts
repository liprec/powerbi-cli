/*
 * Copyright (c) 2020 Jan Pieter Posthuma / DataScenarios
 *
 * All rights reserved.
 *
 * MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";
import chai from "chai";
import { SinonStub } from "sinon";
import { ImportMock } from "ts-mock-imports";

import { getConsts } from "./consts";

import fs from "fs";

const expect = chai.expect;

describe("consts.ts", () => {
    describe("getConsts()", () => {
        const testConsts = getConsts();
        it("PBI scope", () => {
            expect(testConsts.pbiScope).equal("https://analysis.windows.net/powerbi/api/.default offline_access");
        });
        it("PBI scope for AzureCLI", () => {
            expect(testConsts.pbiCLIScope).equal("https://analysis.windows.net/powerbi/api");
        });
        it("authorityHost", () => {
            expect(testConsts.authorityHostUrl).equal("https://login.microsoftonline.com");
        });
        it("powerBIRestURL", () => {
            expect(testConsts.powerBIRestURL).equal("https://api.powerbi.com/v1.0/myorg");
        });
        it("azureRestURL", () => {
            expect(testConsts.azureRestURL).equal("https://management.azure.com");
        });
    });
    describe("getConsts(), cloud set to China", () => {
        let readFileSyncMock: SinonStub<unknown[], unknown>;
        let existsSyncMock: SinonStub<unknown[], unknown>;
        beforeEach(() => {
            readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
            existsSyncMock = ImportMock.mockFunction(fs, "existsSync");
            readFileSyncMock.returns('{ "defaults": {}, "core": { "cloud": "China" } }');
            existsSyncMock.returns(true);
        });
        afterEach(() => {
            readFileSyncMock.restore();
            existsSyncMock.restore();
        });
        const testConsts = getConsts();
        it("PBI scope", () => {
            expect(testConsts.pbiScope).equal("https://analysis.windows.net/powerbi/api/.default offline_access");
        });
        it("PBI scope for AzureCLI", () => {
            expect(testConsts.pbiCLIScope).equal("https://analysis.windows.net/powerbi/api");
        });
        it("authorityHost", () => {
            expect(testConsts.authorityHostUrl).equal("https://login.chinacloudapi.cn");
        });
        it("powerBIRestURL", () => {
            expect(testConsts.powerBIRestURL).equal("https://app.powerbi.cn/v1.0/myorg");
        });
        it("azureRestURL", () => {
            expect(testConsts.azureRestURL).equal("https://management.chinacloudapi.cn");
        });
    });
});
