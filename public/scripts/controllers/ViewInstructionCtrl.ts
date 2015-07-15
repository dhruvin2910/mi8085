///<reference path="../../../typings/angularjs/angular.d.ts"/>

module ViewInstructionCtrl {

  angular.module('mi8085App')
    .controller('ViewInstructionCtrl', function ($scope, $http, $routeParams, $location) {

      $scope.spacedMnemonic = function () {
        return $routeParams.underScoredMnemonic.replace(/_/, ' ');
      };

      $scope.data = {
        instructionDetails: {},
        mnemonic: $scope.spacedMnemonic(),
        canvas: document.getElementById('canvas'),
        ctx: <CanvasRenderingContext2D>(<HTMLCanvasElement> document.getElementById('canvas')).getContext('2d'),
        tStatesData: {
          getTStates: function (end) {
            var machineCycles = $scope.data.instructionDetails.machineCycles.split(' ');
            var totalMachineCycles = 1;
            for (var i = 0; i < end; i++) {
              if (machineCycles[i] == 'F') totalMachineCycles += 4;
              else if (machineCycles[i] == 'S') totalMachineCycles += 6;
              else totalMachineCycles += 3;
            }
            return totalMachineCycles;
          },
          getWidth: function () {
            return 1200 / $scope.data.tStatesData.getTStates($scope.data.instructionDetails.machineCycles.split(' ').length);
          }
        }
      };

      $http.get('/api/mnemonics/' + $scope.data.mnemonic)
        .success(function (response) {
          $scope.data.instructionDetails = response;
          $scope.drawTimingDiagram();
        })
        .error(function (response) {
          alert(response || 'Something went wrong.');
          $location.url('/dashboard');
        });

      $scope.drawTimingDiagram = function () {
        $scope.data.canvas.width = 1200;
        $scope.data.canvas.height = 900;

        var machineCycles = $scope.data.instructionDetails.machineCycles.split(' ');

        $scope.drawLegend();

        $scope.drawBorder();

        for (var i = 0; i < machineCycles.length; i++) {
          $scope.drawMachineCycle(i, machineCycles);
        }

      };

      $scope.drawMachineCycle = function (index, machineCycles) {
        var tState = $scope.data.tStatesData.getTStates(index);
        if (machineCycles[index] == 'F') $scope.drawFetch(tState);
        else if (machineCycles[index] == 'S') $scope.drawExtendedFetch(tState);
        else if (machineCycles[index] == 'R') $scope.drawRead(tState);
        else if (machineCycles[index] == 'W') $scope.drawWrite(tState);
        else if (machineCycles[index] == 'I') $scope.drawIn(tState);
        else if (machineCycles[index] == 'O') $scope.drawOut(tState);
        else $scope.drawBusIdle(tState);
      };

      $scope.drawBorder = function () {
        var ctx = <CanvasRenderingContext2D> $scope.data.ctx;
        ctx.beginPath();
        ctx.moveTo(1199, 0);
        ctx.lineTo(1199, 900);
        ctx.stroke();
      };

      $scope.drawLegend = function () {
        var tStateWidth = $scope.data.tStatesData.getWidth();
        var ctx = <CanvasRenderingContext2D> $scope.data.ctx;


        ctx.save();

        // Draw H-Line Border
        ctx.beginPath();
        ctx.moveTo(0, 1);
        ctx.lineTo(tStateWidth, 1);
        ctx.stroke();

        // Draw H-Line Border
        ctx.beginPath();
        ctx.moveTo(0, 899);
        ctx.lineTo(tStateWidth, 899);
        ctx.stroke();

        // Draw V-Line Border
        ctx.beginPath();
        ctx.moveTo(1, 0);
        ctx.lineTo(1, 900);
        ctx.stroke();

        // Draw V-Line Border
        ctx.beginPath();
        ctx.moveTo(tStateWidth, 0);
        ctx.lineTo(tStateWidth, 900);
        ctx.stroke();

        ctx.font = "12px sans-serif";

        // Draw CLK
        ctx.fillText('CLK', (tStateWidth - ctx.measureText('CLK').width) / 2, 155);

        // Draw A15 && A8
        ctx.fillText('A15 - A8', (tStateWidth - ctx.measureText('A15 - A8').width) / 2, 215);

        // Draw AD7 && AD0
        ctx.fillText('AD7 - AD0', (tStateWidth - ctx.measureText('AD7 - AD0').width) / 2, 275);

        // Draw ALE
        ctx.fillText('ALE', (tStateWidth - ctx.measureText('ALE').width) / 2, 335);

        // Draw IO/M' & S1, S2
        ctx.fillText('IO / M', (tStateWidth - ctx.measureText('IO / M').width) / 2, 395);
        ctx.beginPath();
        ctx.moveTo((tStateWidth - ctx.measureText('IO / M').width) / 2 + 22, 383);
        ctx.lineTo((tStateWidth - ctx.measureText('IO / M').width) / 2 + 31, 383);
        ctx.stroke();

        // Draw RD'
        ctx.fillText('RD', (tStateWidth - ctx.measureText('RD').width) / 2, 455);
        ctx.beginPath();
        ctx.moveTo((tStateWidth - ctx.measureText('RD').width) / 2, 443);
        ctx.lineTo((tStateWidth - ctx.measureText('RD').width) / 2 + 17, 443);
        ctx.stroke();

        // Draw WR'
        ctx.fillText('WR', (tStateWidth - ctx.measureText('WR').width) / 2, 515);
        ctx.beginPath();
        ctx.moveTo((tStateWidth - ctx.measureText('WR').width) / 2 - 1, 503);
        ctx.lineTo((tStateWidth - ctx.measureText('WR').width) / 2 + 18, 503);
        ctx.stroke();

        // Draw MEMR'
        ctx.fillText('MEMR', (tStateWidth - ctx.measureText('MEMR').width) / 2, 575);
        ctx.beginPath();
        ctx.moveTo((tStateWidth - ctx.measureText('MEMR').width) / 2 + 1, 563);
        ctx.lineTo((tStateWidth - ctx.measureText('MEMR').width) / 2 + 36, 563);
        ctx.stroke();


        // Draw MEMW'
        ctx.fillText('MEMW', (tStateWidth - ctx.measureText('MEMW').width) / 2, 635);
        ctx.beginPath();
        ctx.moveTo((tStateWidth - ctx.measureText('MEMR').width) / 2, 623);
        ctx.lineTo((tStateWidth - ctx.measureText('MEMR').width) / 2 + 39, 623);
        ctx.stroke();

        // Draw IOR'
        ctx.fillText('IOR', (tStateWidth - ctx.measureText('IOR').width) / 2, 695);
        ctx.beginPath();
        ctx.moveTo((tStateWidth - ctx.measureText('IOR').width) / 2 + 1, 683);
        ctx.lineTo((tStateWidth - ctx.measureText('IOR').width) / 2 + 20, 683);
        ctx.stroke();

        // Draw IOW'
        ctx.fillText('IOW', (tStateWidth - ctx.measureText('IOW').width) / 2, 755);
        ctx.beginPath();
        ctx.moveTo((tStateWidth - ctx.measureText('IOW').width) / 2 + 1, 743);
        ctx.lineTo((tStateWidth - ctx.measureText('IOW').width) / 2 + 24, 743);
        ctx.stroke();

        ctx.restore();

      };

      $scope.drawFetch = function (tState) {
        var tStateWidth = $scope.data.tStatesData.getWidth();
        var viewWidth = 4 * tStateWidth;
        var leftWidth = tState * $scope.data.tStatesData.getWidth();
        var i;

        var ctx = <CanvasRenderingContext2D> $scope.data.ctx;

        ctx.save();

        // Draw H-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth, 1);
        ctx.lineTo(leftWidth + viewWidth, 1);
        ctx.stroke();

        // Draw H-Line Header
        ctx.save();
        ctx.lineWidth = 0.75;
        for (i = 1; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(leftWidth, 20 * i);
          ctx.lineTo(leftWidth + viewWidth, 20 * i);
          ctx.stroke();
        }
        ctx.restore();

        // Draw H-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth, 899);
        ctx.lineTo(leftWidth + viewWidth, 899);
        ctx.stroke();

        // Draw V-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth, 20);
        ctx.lineTo(leftWidth, 900);
        ctx.stroke();

        // Draw V-Line Columns
        ctx.save();
        ctx.lineWidth = 0.75;
        for (i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(leftWidth + i * tStateWidth, 40);
          ctx.lineTo(leftWidth + i * tStateWidth, 900);
          ctx.stroke();
        }
        ctx.restore();

        // Draw V-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth + viewWidth, 20);
        ctx.lineTo(leftWidth + viewWidth, 900);
        ctx.stroke();

        // Draw CLK
        for (i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(leftWidth + i * tStateWidth, 130);
          ctx.lineTo(leftWidth + i * tStateWidth + tStateWidth / 12, 170);
          ctx.lineTo(leftWidth + i * tStateWidth + tStateWidth / 2, 170);
          ctx.lineTo(leftWidth + i * tStateWidth + 7 * tStateWidth / 12, 130);
          ctx.lineTo(leftWidth + i * tStateWidth + tStateWidth, 130);
          ctx.stroke();
        }

        // Draw A15
        ctx.beginPath();
        ctx.moveTo(leftWidth, 190);
        ctx.lineTo(leftWidth + tStateWidth / 4, 190);
        ctx.lineTo(leftWidth + tStateWidth / 3, 230);
        ctx.lineTo(leftWidth + 13 * tStateWidth / 4, 230);
        ctx.lineTo(leftWidth + 10 * tStateWidth / 3, 190);
        ctx.lineTo(leftWidth + viewWidth, 190);
        ctx.stroke();

        // Draw A8
        ctx.beginPath();
        ctx.moveTo(leftWidth, 230);
        ctx.lineTo(leftWidth + tStateWidth / 4, 230);
        ctx.lineTo(leftWidth + tStateWidth / 3, 190);
        ctx.lineTo(leftWidth + 13 * tStateWidth / 4, 190);
        ctx.lineTo(leftWidth + 10 * tStateWidth / 3, 230);
        ctx.lineTo(leftWidth + viewWidth, 230);
        ctx.stroke();

        // Draw AD7
        ctx.beginPath();
        ctx.moveTo(leftWidth, 250);
        ctx.lineTo(leftWidth + tStateWidth / 4, 250);
        ctx.lineTo(leftWidth + tStateWidth / 3, 290);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 290);
        ctx.lineTo(leftWidth + 31 * tStateWidth / 24, 270);
        // ---
        ctx.moveTo(leftWidth + 3 * tStateWidth / 2, 270);
        ctx.lineTo(leftWidth + 37 * tStateWidth / 24, 250);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 250);
        ctx.lineTo(leftWidth + 65 * tStateWidth / 24, 270);
        ctx.stroke();

        // Draw ---
        ctx.save();
        ctx.setLineDash([5, 2]);
        ctx.beginPath();
        ctx.moveTo(leftWidth + 31 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + 3 * tStateWidth / 2, 270);
        ctx.moveTo(leftWidth + 65 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + viewWidth, 270);
        ctx.stroke();
        ctx.restore();

        // Draw AD0
        ctx.beginPath();
        ctx.moveTo(leftWidth, 290);
        ctx.lineTo(leftWidth + tStateWidth / 4, 290);
        ctx.lineTo(leftWidth + tStateWidth / 3, 250);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 250);
        ctx.lineTo(leftWidth + 31 * tStateWidth / 24, 270);
        // ---
        ctx.moveTo(leftWidth + 3 * tStateWidth / 2, 270);
        ctx.lineTo(leftWidth + 37 * tStateWidth / 24, 290);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 290);
        ctx.lineTo(leftWidth + 65 * tStateWidth / 24, 270);
        ctx.stroke();

        // Draw ALE
        ctx.beginPath();
        ctx.moveTo(leftWidth, 350);
        ctx.lineTo(leftWidth + tStateWidth / 12, 310);
        ctx.lineTo(leftWidth + 2 * tStateWidth / 3, 310);
        ctx.lineTo(leftWidth + 3 * tStateWidth / 4, 350);
        ctx.lineTo(leftWidth + viewWidth, 350);
        ctx.stroke();

        // Draw IO/M' & S1, S2
        ctx.beginPath();
        ctx.moveTo(leftWidth, 370);
        ctx.lineTo(leftWidth + tStateWidth / 4, 370);
        ctx.lineTo(leftWidth + tStateWidth / 3, 410);
        ctx.lineTo(leftWidth + viewWidth, 410);
        ctx.moveTo(leftWidth, 410);
        ctx.lineTo(leftWidth + tStateWidth / 4, 410);
        ctx.lineTo(leftWidth + tStateWidth / 3, 370);
        ctx.lineTo(leftWidth + viewWidth, 370);
        ctx.stroke();

        // Draw RD'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 430);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 430);
        ctx.lineTo(leftWidth + 4 * tStateWidth / 3, 470);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 470);
        ctx.lineTo(leftWidth + 11 * tStateWidth / 4, 430);
        ctx.lineTo(leftWidth + viewWidth, 430);
        ctx.stroke();

        // Draw WR'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 490);
        ctx.lineTo(leftWidth + viewWidth, 490);
        ctx.stroke();

        // Draw MEMR'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 550);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 550);
        ctx.lineTo(leftWidth + 4 * tStateWidth / 3, 590);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 590);
        ctx.lineTo(leftWidth + 11 * tStateWidth / 4, 550);
        ctx.lineTo(leftWidth + viewWidth, 550);
        ctx.stroke();

        // Draw MEMW'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 610);
        ctx.lineTo(leftWidth + viewWidth, 610);
        ctx.stroke();

        // Draw IOR'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 670);
        ctx.lineTo(leftWidth + viewWidth, 670);
        ctx.stroke();

        // Draw IOW'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 730);
        ctx.lineTo(leftWidth + viewWidth, 730);
        ctx.stroke();

        ctx.restore();

      };

      $scope.drawRead = function (tState) {
        var tStateWidth = $scope.data.tStatesData.getWidth();
        var viewWidth = 3 * tStateWidth;
        var leftWidth = tState * $scope.data.tStatesData.getWidth();
        var i;

        var ctx = <CanvasRenderingContext2D> $scope.data.ctx;

        ctx.save();

        // Draw H-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth, 1);
        ctx.lineTo(leftWidth + viewWidth, 1);
        ctx.stroke();

        // Draw H-Line Header
        ctx.save();
        ctx.lineWidth = 0.75;
        for (i = 1; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(leftWidth, 20 * i);
          ctx.lineTo(leftWidth + viewWidth, 20 * i);
          ctx.stroke();
        }
        ctx.restore();

        // Draw H-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth, 899);
        ctx.lineTo(leftWidth + viewWidth, 899);
        ctx.stroke();

        // Draw V-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth, 20);
        ctx.lineTo(leftWidth, 900);
        ctx.stroke();

        // Draw V-Line Columns
        ctx.save();
        ctx.lineWidth = 0.75;
        for (i = 1; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(leftWidth + i * tStateWidth, 40);
          ctx.lineTo(leftWidth + i * tStateWidth, 900);
          ctx.stroke();
        }
        ctx.restore();

        // Draw V-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth + viewWidth, 20);
        ctx.lineTo(leftWidth + viewWidth, 900);
        ctx.stroke();

        // Draw CLK
        for (i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(leftWidth + i * tStateWidth, 130);
          ctx.lineTo(leftWidth + i * tStateWidth + tStateWidth / 12, 170);
          ctx.lineTo(leftWidth + i * tStateWidth + tStateWidth / 2, 170);
          ctx.lineTo(leftWidth + i * tStateWidth + 7 * tStateWidth / 12, 130);
          ctx.lineTo(leftWidth + i * tStateWidth + tStateWidth, 130);
          ctx.stroke();
        }

        // Draw A15
        ctx.beginPath();
        ctx.moveTo(leftWidth, 190);
        ctx.lineTo(leftWidth + tStateWidth / 4, 190);
        ctx.lineTo(leftWidth + tStateWidth / 3, 230);
        ctx.lineTo(leftWidth + viewWidth, 230);
        ctx.stroke();

        // Draw A8
        ctx.beginPath();
        ctx.moveTo(leftWidth, 230);
        ctx.lineTo(leftWidth + tStateWidth / 4, 230);
        ctx.lineTo(leftWidth + tStateWidth / 3, 190);
        ctx.lineTo(leftWidth + viewWidth, 190);
        ctx.stroke();

        // Draw AD7
        ctx.beginPath();
        ctx.moveTo(leftWidth + 7 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + tStateWidth / 3, 290);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 290);
        ctx.lineTo(leftWidth + 31 * tStateWidth / 24, 270);
        // ---
        ctx.moveTo(leftWidth + 3 * tStateWidth / 2, 270);
        ctx.lineTo(leftWidth + 37 * tStateWidth / 24, 250);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 250);
        ctx.lineTo(leftWidth + 65 * tStateWidth / 24, 270);
        ctx.stroke();

        // Draw ---
        ctx.save();
        ctx.setLineDash([5, 2]);
        ctx.beginPath();
        ctx.moveTo(leftWidth, 270);
        ctx.lineTo(leftWidth + 7 * tStateWidth / 24, 270);
        ctx.moveTo(leftWidth + 31 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + 3 * tStateWidth / 2, 270);
        ctx.moveTo(leftWidth + 65 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + viewWidth, 270);
        ctx.stroke();
        ctx.restore();

        // Draw AD0
        ctx.beginPath();
        ctx.moveTo(leftWidth + 7 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + tStateWidth / 3, 250);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 250);
        ctx.lineTo(leftWidth + 31 * tStateWidth / 24, 270);
        // ---
        ctx.moveTo(leftWidth + 3 * tStateWidth / 2, 270);
        ctx.lineTo(leftWidth + 37 * tStateWidth / 24, 290);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 290);
        ctx.lineTo(leftWidth + 65 * tStateWidth / 24, 270);
        ctx.stroke();

        // Draw ALE
        ctx.beginPath();
        ctx.moveTo(leftWidth, 350);
        ctx.lineTo(leftWidth + tStateWidth / 12, 310);
        ctx.lineTo(leftWidth + 2 * tStateWidth / 3, 310);
        ctx.lineTo(leftWidth + 3 * tStateWidth / 4, 350);
        ctx.lineTo(leftWidth + viewWidth, 350);
        ctx.stroke();

        // Draw IO/M' & S1, S2
        ctx.beginPath();
        ctx.moveTo(leftWidth, 370);
        ctx.lineTo(leftWidth + tStateWidth / 4, 370);
        ctx.lineTo(leftWidth + tStateWidth / 3, 410);
        ctx.lineTo(leftWidth + viewWidth, 410);
        ctx.moveTo(leftWidth, 410);
        ctx.lineTo(leftWidth + tStateWidth / 4, 410);
        ctx.lineTo(leftWidth + tStateWidth / 3, 370);
        ctx.lineTo(leftWidth + viewWidth, 370);
        ctx.stroke();

        // Draw RD'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 430);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 430);
        ctx.lineTo(leftWidth + 4 * tStateWidth / 3, 470);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 470);
        ctx.lineTo(leftWidth + 11 * tStateWidth / 4, 430);
        ctx.lineTo(leftWidth + viewWidth, 430);
        ctx.stroke();

        // Draw WR'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 490);
        ctx.lineTo(leftWidth + viewWidth, 490);
        ctx.stroke();

        // Draw MEMR'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 550);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 550);
        ctx.lineTo(leftWidth + 4 * tStateWidth / 3, 590);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 590);
        ctx.lineTo(leftWidth + 11 * tStateWidth / 4, 550);
        ctx.lineTo(leftWidth + viewWidth, 550);
        ctx.stroke();

        // Draw MEMW'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 610);
        ctx.lineTo(leftWidth + viewWidth, 610);
        ctx.stroke();

        // Draw IOR'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 670);
        ctx.lineTo(leftWidth + viewWidth, 670);
        ctx.stroke();

        // Draw IOW'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 730);
        ctx.lineTo(leftWidth + viewWidth, 730);
        ctx.stroke();

        ctx.restore();

      };

      $scope.drawWrite = function (tState) {
        var tStateWidth = $scope.data.tStatesData.getWidth();
        var viewWidth = 3 * tStateWidth;
        var leftWidth = tState * $scope.data.tStatesData.getWidth();
        var i;

        var ctx = <CanvasRenderingContext2D> $scope.data.ctx;

        ctx.save();

        // Draw H-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth, 1);
        ctx.lineTo(leftWidth + viewWidth, 1);
        ctx.stroke();

        // Draw H-Line Header
        ctx.save();
        ctx.lineWidth = 0.75;
        for (i = 1; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(leftWidth, 20 * i);
          ctx.lineTo(leftWidth + viewWidth, 20 * i);
          ctx.stroke();
        }
        ctx.restore();

        // Draw H-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth, 899);
        ctx.lineTo(leftWidth + viewWidth, 899);
        ctx.stroke();

        // Draw V-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth, 20);
        ctx.lineTo(leftWidth, 900);
        ctx.stroke();

        // Draw V-Line Columns
        ctx.save();
        ctx.lineWidth = 0.75;
        for (i = 1; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(leftWidth + i * tStateWidth, 40);
          ctx.lineTo(leftWidth + i * tStateWidth, 900);
          ctx.stroke();
        }
        ctx.restore();

        // Draw V-Line Border
        ctx.beginPath();
        ctx.moveTo(leftWidth + viewWidth, 20);
        ctx.lineTo(leftWidth + viewWidth, 900);
        ctx.stroke();

        // Draw CLK
        for (i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(leftWidth + i * tStateWidth, 130);
          ctx.lineTo(leftWidth + i * tStateWidth + tStateWidth / 12, 170);
          ctx.lineTo(leftWidth + i * tStateWidth + tStateWidth / 2, 170);
          ctx.lineTo(leftWidth + i * tStateWidth + 7 * tStateWidth / 12, 130);
          ctx.lineTo(leftWidth + i * tStateWidth + tStateWidth, 130);
          ctx.stroke();
        }

        // Draw A15
        ctx.beginPath();
        ctx.moveTo(leftWidth, 190);
        ctx.lineTo(leftWidth + tStateWidth / 4, 190);
        ctx.lineTo(leftWidth + tStateWidth / 3, 230);
        ctx.lineTo(leftWidth + viewWidth, 230);
        ctx.stroke();

        // Draw A8
        ctx.beginPath();
        ctx.moveTo(leftWidth, 230);
        ctx.lineTo(leftWidth + tStateWidth / 4, 230);
        ctx.lineTo(leftWidth + tStateWidth / 3, 190);
        ctx.lineTo(leftWidth + viewWidth, 190);
        ctx.stroke();

        // Draw AD7
        ctx.beginPath();
        ctx.moveTo(leftWidth + 7 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + tStateWidth / 3, 290);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 290);
        ctx.lineTo(leftWidth + 31 * tStateWidth / 24, 270);
        // ---
        ctx.moveTo(leftWidth + 3 * tStateWidth / 2, 270);
        ctx.lineTo(leftWidth + 37 * tStateWidth / 24, 250);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 250);
        ctx.lineTo(leftWidth + 65 * tStateWidth / 24, 270);
        ctx.stroke();

        // Draw ---
        ctx.save();
        ctx.setLineDash([5, 2]);
        ctx.beginPath();
        ctx.moveTo(leftWidth, 270);
        ctx.lineTo(leftWidth + 7 * tStateWidth / 24, 270);
        ctx.moveTo(leftWidth + 31 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + 3 * tStateWidth / 2, 270);
        ctx.moveTo(leftWidth + 65 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + viewWidth, 270);
        ctx.stroke();
        ctx.restore();

        // Draw AD0
        ctx.beginPath();
        ctx.moveTo(leftWidth + 7 * tStateWidth / 24, 270);
        ctx.lineTo(leftWidth + tStateWidth / 3, 250);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 250);
        ctx.lineTo(leftWidth + 31 * tStateWidth / 24, 270);
        // ---
        ctx.moveTo(leftWidth + 3 * tStateWidth / 2, 270);
        ctx.lineTo(leftWidth + 37 * tStateWidth / 24, 290);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 290);
        ctx.lineTo(leftWidth + 65 * tStateWidth / 24, 270);
        ctx.stroke();

        // Draw ALE
        ctx.beginPath();
        ctx.moveTo(leftWidth, 350);
        ctx.lineTo(leftWidth + tStateWidth / 12, 310);
        ctx.lineTo(leftWidth + 2 * tStateWidth / 3, 310);
        ctx.lineTo(leftWidth + 3 * tStateWidth / 4, 350);
        ctx.lineTo(leftWidth + viewWidth, 350);
        ctx.stroke();

        // Draw IO/M' & S1, S2
        ctx.beginPath();
        ctx.moveTo(leftWidth, 370);
        ctx.lineTo(leftWidth + tStateWidth / 4, 370);
        ctx.lineTo(leftWidth + tStateWidth / 3, 410);
        ctx.lineTo(leftWidth + viewWidth, 410);
        ctx.moveTo(leftWidth, 410);
        ctx.lineTo(leftWidth + tStateWidth / 4, 410);
        ctx.lineTo(leftWidth + tStateWidth / 3, 370);
        ctx.lineTo(leftWidth + viewWidth, 370);
        ctx.stroke();

        // Draw RD'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 430);
        ctx.lineTo(leftWidth + viewWidth, 430);
        ctx.stroke();

        // Draw WR'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 490);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 490);
        ctx.lineTo(leftWidth + 4 * tStateWidth / 3, 530);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 530);
        ctx.lineTo(leftWidth + 11 * tStateWidth / 4, 490);
        ctx.lineTo(leftWidth + viewWidth, 490);
        ctx.stroke();

        // Draw MEMR'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 550);
        ctx.lineTo(leftWidth + viewWidth, 550);
        ctx.stroke();

        // Draw MEMW'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 610);
        ctx.lineTo(leftWidth + 5 * tStateWidth / 4, 610);
        ctx.lineTo(leftWidth + 4 * tStateWidth / 3, 650);
        ctx.lineTo(leftWidth + 8 * tStateWidth / 3, 650);
        ctx.lineTo(leftWidth + 11 * tStateWidth / 4, 610);
        ctx.lineTo(leftWidth + viewWidth, 610);
        ctx.stroke();

        // Draw IOR'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 670);
        ctx.lineTo(leftWidth + viewWidth, 670);
        ctx.stroke();

        // Draw IOW'
        ctx.beginPath();
        ctx.moveTo(leftWidth, 730);
        ctx.lineTo(leftWidth + viewWidth, 730);
        ctx.stroke();

        ctx.restore();

      };

    });

}