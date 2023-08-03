import { Trx } from "../src/trx";

describe("trx", () => {
  test('Trx', () => {
    let trx = new Trx();
    // don't be too happy :)
    // this is non-existing wallet private key and id
    trx.signMessage("cd119e94-e2f2-4914-abd1-1cd004410b1a", "xprv9s21ZrQH143K25usbyrE6MWu15UfzRtkWMx8rebreT1PKvJ8ecY4Uktr4hYdwHkBEBeYifvYwg2fkaGZmSZbFYfiPv1NDMfMqFPffrBn1d6",);
  });
});

