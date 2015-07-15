///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/express/express.d.ts"/>

import express = require('express');
import fs = require('fs');

export var data:any[] = JSON.parse(fs.readFileSync(__dirname + '/data/data.json').toString() || '[]');
export var router = express.Router();

router.get('/', function (req, res) {
  res.writeHead(200, 'OK');
  res.end(JSON.stringify(data));
});

router.get('/:mnemonic', function (req, res) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].mnemonic == req.params['mnemonic']) {
      res.writeHead(200, 'OK');
      res.end(JSON.stringify(data[i]));
      return;
    }
  }
  res.writeHead(404, 'Not found.');
  res.end('No data found');
});

router.put('/:mnemonic', function (req, res) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].mnemonic == req.params['mnemonic']) {
      for (var property in data[i]) {
        if (data[i].hasOwnProperty(property)) {
          data[i][property] = req.body[property] || data[i][property];
        }
      }
      fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(data));
      res.writeHead(200, 'OK');
      res.end(JSON.stringify(data[i]));
      return;
    }
  }
  res.writeHead(404, 'Not found.');
  res.end('No data found');
});

router.post('/:mnemonic', function (req, res) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].mnemonic == req.params['mnemonic']) {
      for (var property in data[i]) {
        if (data[i].hasOwnProperty(property)) {
          data[i][property] = req.body[property] || data[i][property];
        }
      }
      fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(data));
      res.writeHead(200, 'OK');
      res.end(JSON.stringify(data[i]));
      return;
    }
  }
  var newData = new Instruction();
  for (var property in newData) {
    if (newData.hasOwnProperty(property)) {
      newData[property] = req.body[property] || newData[property];
    }
  }
  data.push(newData);
  fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(data));
  res.writeHead(200, 'OK');
  res.end();
});

router.delete('/:mnemonic', function (req, res) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].mnemonic == req.params['mnemonic']) {
      data.splice(i, 1);
      fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(data));
      res.writeHead(200, 'OK');
      res.end();
      return;
    }
  }
  res.writeHead(404, 'Not found.');
  res.end('No data found');
});

router.all('*', function (req, res) {
  res.writeHead(200, 'OK');
  res.end('Not allowed');
});

export class Instruction {

  // Mnemonics
  mnemonic:string;
  opcode:string;
  operand:string;
  group:string;

  instruction:string;
  code:string;
  addressingMode:string;

  // BMT
  bytes:string;
  mCycles:string;
  tStates:string;
  machineCycles:string;

  // Flags Affected
  flagsAffected:{
    all:string;
    none:string;
    s:string;
    z:string;
    ac:string;
    p:string;
    cy:string;
  };

  // Example & Notes
  example:string;
  notes:string;

  constructor() {
    this.mnemonic = '';
    this.opcode = '';
    this.operand = '';
    this.group = '';

    this.addressingMode = '';
    this.instruction = '';
    this.code = '';

    this.bytes = '';
    this.mCycles = '';
    this.tStates = '';
    this.machineCycles = '';

    this.flagsAffected = {
      all: '',
      none: '',
      s: '',
      z: '',
      ac: '',
      p: '',
      cy: ''
    };
    this.example = '';
    this.notes = '';
  }
}
