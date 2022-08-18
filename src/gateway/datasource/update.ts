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
import { OptionValues } from "commander";

import { debug } from "../../lib/logging";
import { APICall, executeAPICall } from "../../lib/api";
import { validateGatewayId, validateGatewayDatasourceId } from "../../lib/parameters";
import { getOptionContent } from "../../lib/options";

export async function updateAction(...args: unknown[]): Promise<void> {
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;
    const gatewayId = await validateGatewayId(options.G, true);
    const datasourceId = await validateGatewayDatasourceId(gatewayId as string, options.D, true);
    if (options.credential === undefined && options.credentialFile === undefined)
        throw "error: missing option '--credential' or '--credential-file'";
    const credential = JSON.parse(getOptionContent(options.credential || `@${options.credentialFile}`) as string);
    debug(`Update the credentials of a Power BI datasource from gateway (${gatewayId})`);
    const request: APICall = {
        method: "PATCH",
        url: `/gateways/${gatewayId}/datasources/${datasourceId}`,
        body: credential,
    };
    await executeAPICall(request);
}
