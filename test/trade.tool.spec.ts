import tradeTool from "../src/tool/trade.tool";
import {ethers} from "ethers";

describe('getCommission', () => {
    it('should return half fee calculated by value and fee %', async () => {
        const fee = tradeTool.getTradeFee(0.25 / 100, 0, ethers.parseEther('1')).toString()

        expect(fee).toBe("2500000000000000")
    })
})
