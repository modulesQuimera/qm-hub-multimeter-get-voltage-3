module.exports = function(RED) {

    "use strict";
    var mapeamentoNode;

    function getVoltage3Node(config) {
        RED.nodes.createNode(this, config);
        this.compare_selectA = config.compare_selectA;
        this.maxValueA = config.maxValueA;
        this.minValueA = config.minValueA;

        this.compare_selectB = config.compare_selectB;
        this.maxValueB = config.maxValueB;
        this.minValueB = config.minValueB;

        this.compare_selectC = config.compare_selectC;
        this.maxValueC = config.maxValueC;
        this.minValueC = config.minValueC;
        var node = this
        node.AC_mode = config.AC_mode === "true" ? true : false;
        node.scale = config.scale;
        mapeamentoNode = RED.nodes.getNode(this.mapeamento);
        
        node.on('input', function(msg, send, done) {
            var _phaseA = {}
            var _phaseB = {}
            var _phaseC = {}
            if (node.compare_selectA == "interval") {
                _phaseA = {">=": parseFloat(node.minValueA), "<=": parseFloat(node.maxValueA)}
            }
            if (node.compare_selectA == "maxValue") {
                _phaseA = {">=": null, "<=": parseFloat(node.maxValueA)}
            }
            if (node.compare_selectA == "minValue") {
                _phaseA = {">=": parseFloat(node.minValueA), "<=": null}
            }
            
            if (node.compare_selectB == "interval") {
                _phaseB = {">=": parseFloat(node.minValueB), "<=": parseFloat(node.maxValueB)}
            }
            if (node.compare_selectB == "maxValue") {
                _phaseB = {">=": null, "<=": parseFloat(node.maxValueB)}
            }
            if (node.compare_selectB == "minValue") {
                _phaseB = {">=": parseFloat(node.minValueB), "<=": null}
            }
            
            if (node.compare_selectC == "interval") {
                _phaseC = {">=": parseFloat(node.minValueC), "<=": parseFloat(node.maxValueC)}
            }
            if (node.compare_selectC == "maxValue") {
                _phaseC = {">=": null, "<=": parseFloat(node.maxValueC)}
            }
            if (node.compare_selectC == "minValue") {
                _phaseC = {">=": parseFloat(node.minValueC), "<=": null}
            }
            var _compare = {
                phase_A: _phaseA,
                phase_B: _phaseB,
                phase_C: _phaseC,
            }
            var globalContext = node.context().global;
            var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: " multimeter_modular_V1.0",
                slot: 1,
                method: "get_voltage_3",
                AC_mode: node.AC_mode ,
                scale: parseFloat(node.scale),
                compare: _compare
            }
            var file = globalContext.get("exportFile")
            var slot = globalContext.get("slot");
            if(currentMode == "test"){file.slots[slot].jig_test.push(command)}
            else{file.slots[slot].jig_error.push(command)}
            globalContext.set("exportFile", file);
            console.log(command)
            send(msg)
        });
    }
    RED.nodes.registerType("get-voltage-3", getVoltage3Node);
}