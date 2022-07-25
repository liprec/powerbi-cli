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

import { dump } from "js-yaml";
import { Parser } from "json2csv";
import jmespath from "jmespath";
import { createWriteStream, writeFileSync } from "fs";
import { Readable, Transform, TransformCallback } from "stream";
import chalk from "chalk";
import { verbose } from "./logging";

export enum OutputType {
    json = "json",
    csv = "csv",
    tsv = "tsv",
    yml = "yml",
    raw = "raw",
    none = "none",
    unknown = "",
}

export function formatAndPrintOutput(
    response: unknown,
    outputType: OutputType = OutputType.json,
    outputFile?: string,
    query?: string,
    command = "pbicli"
): void {
    if (!response) return;
    if (outputType === OutputType.raw || outputType === OutputType.none) {
        return;
    }
    let output = JSON.parse(JSON.stringify(response));
    if (query) {
        try {
            output = jmespath.search(output, query);
        } catch (err) {
            console.error(chalk.red(`${command}: error: argument --query: ${err}`));
            return;
        }
    }
    switch (outputType) {
        case OutputType.json:
        default:
            if (outputFile) {
                writeFileSync(outputFile, JSON.stringify(output, null, " "));
            } else {
                console.info(JSON.stringify(output, null, " "));
            }
            break;
        case OutputType.yml:
            console.info(dump(output));
            break;
        case OutputType.tsv:
            try {
                if (output === null) return;
                const json2csvParser = new Parser({ header: false, delimiter: "\t", quote: "" });
                console.info(json2csvParser.parse(output));
            } catch {
                console.error(chalk.red("Error parsing data to tsv format."));
            }
            break;
    }
}

export function formatAndPrintOutputStream(
    response: Readable,
    outputType: OutputType = OutputType.json,
    outputFile?: string,
    query?: string
): void {
    let hasRows = false,
        breaker = "",
        rawData = "";
    const isHeader = outputType === OutputType.json || outputType === OutputType.csv;
    const isCsv = outputType === OutputType.csv;

    if (!response) return;
    if (outputType === OutputType.raw || outputType === OutputType.none) {
        return;
    }
    const outputStream = new Transform({
        transform(this: Transform, chunk: string, encoding: BufferEncoding, callback: TransformCallback) {
            rawData += chunk;
            callback();
        },
        flush(this: Transform, callback: TransformCallback) {
            let data = JSON.parse(rawData),
                result = "";
            if (query) {
                try {
                    data = jmespath.search(data, query)[0];
                } catch (err) {
                    console.error(chalk.red(`Error parsing query: ${query} (${err})`));
                    return;
                }
            }
            if (data) {
                switch (outputType) {
                    case OutputType.json:
                    default:
                        result = `${JSON.stringify(data, null, 2)}`;
                        breaker = ",";
                        break;
                    case OutputType.yml:
                        result = dump(data);
                        breaker = "\n";
                        break;
                    case OutputType.tsv:
                    case OutputType.csv:
                        try {
                            const json2csvParser = new Parser({
                                header: isCsv && isHeader && !hasRows,
                                delimiter: isCsv ? "," : "\t",
                                quote: isCsv ? "'" : "",
                            });
                            result = json2csvParser.parse(data);
                            breaker = "\n";
                        } catch {
                            console.error(chalk.red("Error parsing data to tsv format."));
                        }
                        break;
                }
                this.push(`${hasRows ? breaker : ""}${result}`);
                hasRows = true;
            }
            callback();
        },
    });
    response.on("error", (err) => {
        verbose(`Error in RowSet result found`);
        console.error(chalk.red(err.message));
    });
    response.pipe(outputStream).pipe(outputFile ? createWriteStream(outputFile) : process.stdout);
}

export function formatAndPrintOutputRawStream(
    response: Readable,
    outputType: OutputType = OutputType.json,
    outputFile?: string,
    query?: string
): void {
    let hasResult = false,
        hasRows = false,
        breaker = "";
    const isHeader = outputType === OutputType.json || outputType === OutputType.csv;
    const isCsv = outputType === OutputType.csv;

    if (!response) return;
    if (outputType === OutputType.raw || outputType === OutputType.none) {
        return;
    }
    const outputStream = new Transform({
        transform(this: Transform, chunk: string, encoding: BufferEncoding, next: TransformCallback) {
            let data = JSON.parse(chunk),
                result = "";
            if (data === "[" || data == "]") {
                switch (outputType) {
                    case OutputType.json:
                    default:
                        this.push(`${data === "[" && hasResult ? ",\n" : ""}${data === "]" ? "\n" : ""}${data}`);
                        break;
                    case OutputType.yml:
                    case OutputType.tsv:
                    case OutputType.csv:
                        if (data === "[" && hasResult) this.push("\n");
                        break;
                }
                hasResult = true;
                hasRows = false;
            } else {
                if (query) {
                    try {
                        data = jmespath.search([data], query)[0];
                    } catch (err) {
                        console.error(chalk.red(`Error parsing query: ${query} (${err})`));
                        return;
                    }
                }
                if (data) {
                    switch (outputType) {
                        case OutputType.json:
                        default:
                            result = `${JSON.stringify([data], null, 2).slice(0, -2).substring(1)}`;
                            breaker = ",";
                            break;
                        case OutputType.yml:
                            result = dump(JSON.parse(`[${JSON.stringify(data)}]`)).slice(0, -1);
                            breaker = "\n";
                            break;
                        case OutputType.tsv:
                        case OutputType.csv:
                            try {
                                const json2csvParser = new Parser({
                                    header: isCsv && isHeader && !hasRows,
                                    delimiter: isCsv ? "," : "\t",
                                    quote: isCsv ? "'" : "",
                                });
                                result = json2csvParser.parse(data);
                                breaker = "\n";
                            } catch {
                                console.error(chalk.red("Error parsing data to tsv format."));
                            }
                            break;
                    }
                    this.push(`${hasRows ? breaker : ""}${result}`);
                    hasRows = true;
                }
            }
            next();
        },
    });
    response.on("error", (err) => {
        verbose(`Error in RowSet result found`);
        console.error(chalk.red(err.message));
    });
    response.pipe(outputStream).pipe(outputFile ? createWriteStream(outputFile) : process.stdout);
}
