/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Lote } from './lote';
import { Cosecha } from './cosecha';

export class FabCar extends Contract {
    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger  ===========');
        const lotes: Lote[] = [
            {
                loteId: 1,
                cantidad: '100',
                cosechaId: 1
            }
        ];
        for (let i = 0; i < lotes.length; i++) {
            lotes[i].docType = 'lote';
            await ctx.stub.putState('LOTE' + i, Buffer.from(JSON.stringify(lotes[i])));
            console.info('Added <--> ', lotes[i]);
        }
        const cosechas: Cosecha[] = [
            {
                cosechaId: 1,
                cantidad: '80'
            }

        ];        
        for (let i = 0; i < cosechas.length; i++) {
            lotes[i].docType = 'cosecha';
            await ctx.stub.putState('COSECHA' + i, Buffer.from(JSON.stringify(cosechas[i])));
            console.info('Added <--> ', cosechas[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryLote(ctx: Context, loteNumber: string): Promise<string> {
        const loteAsBytes = await ctx.stub.getState(loteNumber); // get the lote from chaincode state
        if (!loteAsBytes || loteAsBytes.length === 0) {
            throw new Error(`${loteNumber} does not exist`);
        }
        console.log(loteAsBytes.toString());
        return loteAsBytes.toString();
    }
    
    public async createLote(ctx: Context, loteNumber: string, loteId: number, cantidad: string, cosechaId: number) {
        console.info('============= START : Create Lote ===========');

        const lote: Lote = {
            loteId,
            docType: 'lote',
            cantidad,
            cosechaId,
        };

        await ctx.stub.putState(loteNumber, Buffer.from(JSON.stringify(lote)));
        console.info('============= END : Create Lote ===========');
    }
    
    public async queryAllLotes(ctx: Context): Promise<string> {
        const startKey = 'LOTE0';
        const endKey = 'LOTE9999';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
    
    public async changeLoteCantidad(ctx: Context, loteNumber: string, newCantidad: string) {
        console.info('============= START : changeLoteCantidad ===========');

        const loteAsBytes = await ctx.stub.getState(loteNumber); // get the car from chaincode state
        if (!loteAsBytes || loteAsBytes.length === 0) {
            throw new Error(`${loteNumber} does not exist`);
        }
        const lote: Lote = JSON.parse(loteAsBytes.toString());
        lote.cantidad = newCantidad;

        await ctx.stub.putState(loteNumber, Buffer.from(JSON.stringify(lote)));
        console.info('============= END : changeLoteCantidad ===========');
    }

    public async queryCosecha(ctx: Context, cosechaNumber: string): Promise<string> {
        const cosechaAsBytes = await ctx.stub.getState(cosechaNumber); // get the lote from chaincode state
        if (!cosechaAsBytes || cosechaAsBytes.length === 0) {
            throw new Error(`${cosechaNumber} does not exist`);
        }
        console.log(cosechaAsBytes.toString());
        return cosechaAsBytes.toString();
    }
    
    public async createCosecha(ctx: Context, cosechaNumber: string, cosechaId: number, cantidad: string) {
        console.info('============= START : Create Cosecha ===========');

        const cosecha: Cosecha = {
            cosechaId,
            docType: 'cosecha',
            cantidad,
        };

        await ctx.stub.putState(cosechaNumber, Buffer.from(JSON.stringify(cosecha)));
        console.info('============= END : Create Cosecha ===========');
    }
    
    public async queryAllCosechas(ctx: Context): Promise<string> {
        const startKey = 'COSECHA0';
        const endKey = 'COSECHA9999';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
    
    public async changeCosechaCantidad(ctx: Context, cosechaNumber: string, newCantidad: string) {
        console.info('============= START : changeCosechaCantidad ===========');

        const cosechaAsBytes = await ctx.stub.getState(cosechaNumber); // get the car from chaincode state
        if (!cosechaAsBytes || cosechaAsBytes.length === 0) {
            throw new Error(`${cosechaNumber} does not exist`);
        }
        const cosecha: Cosecha = JSON.parse(cosechaAsBytes.toString());
        cosecha.cantidad = newCantidad;

        await ctx.stub.putState(cosechaNumber, Buffer.from(JSON.stringify(cosecha)));
        console.info('============= END : changeCosechaCantidad ===========');
    }

}
