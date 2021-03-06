var to = require("./to");
var FakeTransaction = require('ethereumjs-tx/fake.js');
var utils = require("ethereumjs-util");

module.exports = {
  toJSON: function(tx, block) {
    var transactionIndex = 0
    for (var i = 0; i < block.transactions.length; i++) {
      var current = block.transactions[i];
      if (current.hash().equals(tx.hash())) {
        transactionIndex = i;
        break;
      }
    }
    return {
      hash: to.hex(tx.hash()),
      nonce: to.hex(tx.nonce),
      blockHash: to.hex(block.hash()),
      blockNumber: to.hex(block.header.number),
      transactionIndex: to.hex(transactionIndex),
      from: to.hex(tx.from),
      to: to.hex(tx.to),
      value: to.hex(tx.value),
      gas: to.hex(tx.gasLimit),
      gasPrice: to.hex(tx.gasPrice),
      input: to.hex(tx.data),
    };
  },

  fromJSON: function(json) {
    var tx = new FakeTransaction({
      nonce: utils.toBuffer(json.nonce),
      from: utils.toBuffer(json.from),
      value: utils.toBuffer("0x" + json.value.toString(16)),
      gasLimit: utils.toBuffer(json.gas),
      gasPrice: utils.toBuffer("0x" + json.gasPrice.toString(16)),
      data: utils.toBuffer(json.input)
    });

    if (json.to) {
      // Remove all padding and make it easily comparible.
      var buf = utils.toBuffer(json.to);
      if (!buf.equals(utils.toBuffer('0x0'))) {
        tx.to = utils.setLengthLeft(buf, 20);
      }
    }

    return tx;
  }
};
