async function createTransaction(tronWeb, type, value, Permission_id, options = {}) {
    // const metaData = await getHeaderInfo(tronWeb.fullNode);
    // const tx = {
    //     visible: false,
    //     txID: '',
    //     raw_data_hex: '',
    //     raw_data: {
    //         contract: [{
    //             parameter: {
    //                 value,
    //                 type_url: `type.googleapis.com/protocol.${type}`,
    //             },
    //             type,
    //         }],
    //         ...metaData,
    //         ...options,
    //     },
    // };
    // if (Permission_id) {
    //     tx.raw_data.contract[0].Permission_id = Permission_id;
    // }
    // const pb = txJsonToPb(tx);
    // tx.txID = txPbToTxID(pb).replace(/^0x/, '');
    // tx.raw_data_hex = txPbToRawDataHex(pb).toLowerCase();
    // return tx;
}
