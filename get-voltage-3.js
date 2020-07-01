module.exports = function(RED) {

    "use strict";
    var mapeamentoNode;

    function getVoltage3Node(config) {
        RED.nodes.createNode(this, config);
        var node = this
        node.AC_mode = config.AC_mode === "true" ? true : false;
        node.scale = config.scale;
        // this.websocket = config.websocket;
        // this.websocketConfig = RED.nodes.getNode(this.websocket);
        mapeamentoNode = RED.nodes.getNode(this.mapeamento);
        
        // if (this.serialConfig) {
        // node.port = serialPool.get(this.serialConfig);
        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: " multimeter_modular_V1.0",
                slot: 1,
                method: "get_voltage_3",
                // channel_number: parseInt(node.channel_number),
                AC_mode: node.AC_mode ,
                scale: parseFloat(node.scale) 
            }
            var file = globalContext.get("exportFile")
            var slot = globalContext.get("slot");
            if(currentMode == "test"){file.slots[slot].jig_test.push(command)}
            else{file.slots[slot].jig_error.push(command)}
            globalContext.set("exportFile", file);
            // node.status({fill:"green", shape:"dot", text:"done"}); // seta o status pra waiting
            // msg.payload = command
            send(msg)
        });
    }
    RED.nodes.registerType("get-voltage-3", getVoltage3Node);

    // RED.httpAdmin.get("/getVoltage3",function(req,res) {
    //     console.log(mapeamentoNode)
    //     if(mapeamentoNode){
    //         res.json([
    //             {value:mapeamentoNode.valuePort1, label: mapeamentoNode.labelPort1, hasValue:false},
    //         ])
    //     }
    //     else{
    //         res.json([
    //             {label:"APW |BPW | CPW", value: "0", hasValue:false},
    //         ])
    //     }
    // });
}