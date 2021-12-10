/* parser generated by jison 0.4.15 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var print_text = '';
var rec_name,rec_address,rec_phone,rec_notes,addressMap, headerMap, resultMap, imagePath, pricesMap, orderNumMap, rec_web,labelProducts, rec_total,rec_bagcharges;
var rec_subtitle,rec_header1,rec_header2,rec_header3,rec_header4,rec_map1,rec_map2,rec_map3,rec_map4,rec_footer1,rec_footer2,rec_footer3,rec_footer4,rec_footer5,rec_footer6,rec_thanks;
var lineLength = 48,fontSize = 1;
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5,6,8,9,10,11,12,13,14,15,17,18],$V1=[1,3],$V2=[1,4],$V3=[1,6],$V4=[1,7],$V5=[1,8],$V6=[1,9],$V7=[1,10],$V8=[1,11],$V9=[1,12],$Va=[1,13],$Vb=[1,14],$Vc=[1,15],$Vd=[5,6,8,9,10,11,12,13,14,15,17,18];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"input":3,"line":4,"EOF":5,"NEWLINE":6,"content":7,"ID":8,"EXTRA":9,"STYLE1":10,"STYLE2":11,"STYLE3":12,"STYLE4":13,"STYLE5":14,"IDLEFT":15,"IDRIGHT":16,"HLINE":17,"CUT":18,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"NEWLINE",8:"ID",9:"EXTRA",10:"STYLE1",11:"STYLE2",12:"STYLE3",13:"STYLE4",14:"STYLE5",15:"IDLEFT",16:"IDRIGHT",17:"HLINE",18:"CUT"},
productions_: [0,[3,0],[3,2],[4,1],[4,1],[4,2],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,3],[7,1],[7,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 3:

            console.log("EOF");
            
            //printBuffer();
        
break;
case 4:

            console.log("NEWLINE");
            
            printerBuff += " ";
            printBuffer();
        
break;
case 6:

            console.log("ID");
            
            printerBuff += $$[$0];
        
break;
case 7:

            console.log("EXTRA");
            
            printerBuff += $$[$0];
        
break;
case 8:

            console.log("STYLE1");
            
            //lineLength = 24;
            if(typeof ESCPOSPrinter != "undefined"){
                ESCPOSPrinter.setTextProperties(0,0,4,2,2);
            }
            else
                console.log("ESCPOSPrinter is not defined...");
        
break;
case 9:

            console.log("STYLE2");
            
            //lineLength = 42;
            if(typeof ESCPOSPrinter != "undefined"){
                ESCPOSPrinter.setTextProperties(1,1,2,1,2);
            }
            else
                console.log("ESCPOSPrinter is not defined...");
        
break;
case 10:

            console.log("STYLE3");
            
            //lineLength = 24;
            if(typeof ESCPOSPrinter != "undefined"){
                ESCPOSPrinter.setTextProperties(1,1,1,2,1);
            }
            else
                console.log("ESCPOSPrinter is not defined...");
        
break;
case 11:

            console.log("STYLE4");
    
            //lineLength = 48;
            if(typeof ESCPOSPrinter != "undefined"){
                ESCPOSPrinter.setTextProperties(0,1,0,1,1);
            }
            else
                console.log("ESCPOSPrinter is not defined...");
        
break;
case 12:

        console.log("STYLE5");
        
        //lineLength = 48;
        if(typeof ESCPOSPrinter != "undefined"){
            ESCPOSPrinter.setTextProperties(2,0,0,1,1);
        }
        else
            console.log("ESCPOSPrinter is not defined...");
    
break;
case 13:

            console.log("IDLEFT ID IDRIGHT");
            
            var stringPair = $$[$0-1];
            
            var stringList = stringPair.split(":");
            
            if(stringList.length == 2){
                
                if(stringList[0] == "var"){
					var lineLengthTmp =lineLength/fontSize;
					printerBuff = "";
					var str = eval(stringList[1]);
					var res = str.match(new RegExp('.{1,' + lineLengthTmp + '}', 'g'));
                    printerBuff+= res.join('\n');
					printBuffer();
                }
				else if(stringList[0] == "center"){
                    var4 = eval(stringList[1]);
					len = lineLength - (var4.length*fontSize);
					printerBuff = "";
					for (var j = 0; j < len/(2*fontSize); j++)
						printerBuff += " ";
					printerBuff += var4;
					printBuffer();
                }
                else if(stringList[0] == "list"){
                    list = eval(stringList[1]);
                    printBuffer();
                    
                    for (var i = 0; i < list.length; i++){
                        console.log(list[i]);
                        printerBuff += list[i];
                        printBuffer();
                    }
                }
                else if(stringList[0] == "hmap"){
                    map = eval(stringList[1]);
                    printerBuff = "";
                    
                    for (var i = 0; i < map.length; i++){
                        var1 = map[i][0].toString();
                        var2 = map[i][1].toString();
						var3 = map[i][2].toString();
                        var lineLengthTmp =lineLength/fontSize;
                        console.log(var1+" ---------- "+var2+" ---------- "+var3);
                        
						if(var2 == "INNER_DASH"){
							var buff = "";
							for (var j = 0; j < lineLength/fontSize; j++)
								buff += "-";
							printerBuff = buff;
							printBuffer();
							continue;
						}else if(var2 == "NEWLINE"){
							printerBuff = "";
							printBuffer();
							continue;
						}
						
                        printerBuff += var1;
						var var1_len = var1.length+1;
                        len = lineLengthTmp - (var1.length + var2.length + var3.length);
                        for (var j = 0; j < (var1_len-var1.length); j++)
                            printerBuff += " ";
                        
						//var var2_len = lineLengthTmp-(var1_len+var3.length+1);
						var var2_len = lineLengthTmp-var1_len;
						var res = var2.match(new RegExp('.{1,' + var2_len + '}', 'g'));
						//printerBuff+= res.join('\n     ');
						for(var k=0;k<res.length;k++){
							printerBuff+=res[k];
							if(k!=res.length-1){
								printerBuff+="\n";
								for(var s=0;s<var1_len;s++)
									printerBuff+=" ";
							}
						}
						
						var var3_start;
						if(res.length > 1){
							var3_start = (res[res.length-1].length%lineLengthTmp)+var1_len;
						}else{
							var3_start = printerBuff.length;
						}
                        
						if(var3_start >= lineLengthTmp-var3.length-1 && var3.length){
							printerBuff += "\n";
							var3_start = 0;
						}
						for (var j = var3_start; j < lineLengthTmp-var3.length; j++)
							printerBuff += " ";
						
						printerBuff += var3;
                        printBuffer();
                    }
                }
				else if(stringList[0] == "map"){
                    map = eval(stringList[1]);
                    printerBuff = "";
					var temp_buff = [];
                    
                    for (var i = 0; i < map.length; i++){
                        var1 = map[i][0].toString();
                        var2 = map[i][1].toString();
						var3 = map[i][2].toString();
                        temp_buff = [];
                        console.log(var1+" ---------- "+var2+" ---------- "+var3);
                        
						if(var2 == "INNER_DASH"){
							var buff = "";
							for (var j = 0; j < lineLength/fontSize; j++)
								buff += "-";
							printerBuff = buff;
							printBuffer();
							continue;
						}
					
						var lineLengthTmp =lineLength/fontSize;
						if(var1.length > (lineLengthTmp-3)){
							var res = var1.match(new RegExp('.{1,' + (lineLengthTmp-3) + '}', 'g'));
							for(var c=0;c<res.length;c++){
								var1 = res[c];
								if(c>=res.length-1){
									printerBuff += var1;
								}else{
									temp_buff.push(var1);
								}
							}
						}else{
							printerBuff += var1;
						}
						
                        len = (lineLengthTmp - (var1.length + var2.length + var3.length));
						var space_len = Math.floor(len/3);
						if((!var1.length&&!var2.length) ||(!var2.length&&!var3.length) || (!var1.length&&!var3.length)){
							space_len = Math.floor(len/2);
						}else if(var1.length && var2.length && var3.length){
							space_len = Math.floor(len/4);
						}
                        for (var j = 0; j < space_len; j++)
                            printerBuff += " ";
                        
                        printerBuff += var2;
						var org_string = printerBuff;
						//if(fontSize>1)
							//org_string = printerBuff.trim();
						for (var j = (org_string.length)+(printerBuff.length-org_string.length); j < (lineLengthTmp-var3.length); j++)
                            printerBuff += " ";
						printerBuff += var3;
						
						if(temp_buff.length){
							printerBuff = temp_buff.join("\n")+"\n"+printerBuff;
						}
                        printBuffer();
                    }
                }
                else if(stringList[0] == "barcode"){
                    code = eval(stringList[1]);
                    printBuffer();
                    
                    if(typeof ESCPOSPrinter != "undefined"){
                        ESCPOSPrinter.feedControl(0);
                        ESCPOSPrinter.printBarcode(code, 69, 2, 50, 2, 1);
                        ESCPOSPrinter.feedControl(0);
                    }
                    else
                        console.log("ESCPOSPrinter is not defined...");
                }
                else if(stringList[0] == "qrcode"){
                    code = eval(stringList[1]);
                    printBuffer();
                    
                    if(typeof ESCPOSPrinter != "undefined"){
                        ESCPOSPrinter.feedControl(0);
                        ESCPOSPrinter.printQRCode(code, 51, 3);
                        ESCPOSPrinter.feedControl(0);
                    }
                    else
                        console.log("ESCPOSPrinter is not defined...");
                }
                else if(stringList[0] == "image"){
                    path = eval(stringList[1]);
                    printBuffer();
                    
                    if(typeof ESCPOSPrinter != "undefined"){
                        ESCPOSPrinter.feedControl(0);
                        ESCPOSPrinter.printImage(path, 1, 15);
                        ESCPOSPrinter.feedControl(0);
                    }
                    else
                        console.log("ESCPOSPrinter is not defined...");
                }
                else
                    console.log("Invalid ID...");
            }
            else
                console.log("Invalid ID...");
        
break;
case 14:

            console.log("HLINE");
			var buff = "";
			for (var i = 0; i < lineLength/fontSize; i++)
				buff += "-";
			printerBuff = buff;
			printBuffer();
            /*if(typeof ESCPOSPrinter != "undefined"){
                ESCPOSPrinter.feedControl(0);
                var buff = "";
                for (var i = 0; i < lineLength; i++)
                    buff += "-";
                ESCPOSPrinter.printRawText(buff);
                ESCPOSPrinter.feedControl(0);
            }
            else
                console.log("ESCPOSPrinter is not defined...");*/
        
break;
case 15:

            console.log("CUT");
            
            printBuffer();
            
            if(typeof ESCPOSPrinter != "undefined"){
                ESCPOSPrinter.feedControl(0);
                ESCPOSPrinter.feedControl(0);
                ESCPOSPrinter.feedControl(0);
                ESCPOSPrinter.cutPaper();
            }
            else
                console.log("ESCPOSPrinter is not defined...");
        
break;
}
},
table: [o($V0,[2,1],{3:1}),{1:[3],4:2,5:$V1,6:$V2,7:5,8:$V3,9:$V4,10:$V5,11:$V6,12:$V7,13:$V8,14:$V9,15:$Va,17:$Vb,18:$Vc},o($V0,[2,2]),o($V0,[2,3]),o($V0,[2,4]),{4:16,5:$V1,6:$V2,7:5,8:$V3,9:$V4,10:$V5,11:$V6,12:$V7,13:$V8,14:$V9,15:$Va,17:$Vb,18:$Vc},o($Vd,[2,6]),o($Vd,[2,7]),o($Vd,[2,8]),o($Vd,[2,9]),o($Vd,[2,10]),o($Vd,[2,11]),o($Vd,[2,12]),{8:[1,17]},o($Vd,[2,14]),o($Vd,[2,15]),o($V0,[2,5]),{16:[1,18]},o($Vd,[2,13])],
defaultActions: {},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        function lex() {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    if(typeof ESCPOSPrinter != "undefined"){
        ESCPOSPrinter.init();
    }

    var printerBuff = "";
    
    function printBuffer(){
        print_text+=printerBuff+"\n";
		console.log(printerBuff);
        /*if(printerBuff != ""){
            if(typeof ESCPOSPrinter != "undefined"){
                ESCPOSPrinter.printRawText(printerBuff);
                ESCPOSPrinter.feedControl(0);
            }
            else
              console.log("ESCPOSPrinter is not defined...");
        }
        else
            console.log("printerBuffer is empty...");*/
        
        printerBuff = "";
    }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 8
break;
case 1:return 10
break;
case 2:return 11
break;
case 3:return 12
break;
case 4:return 13
break;
case 5:return 14
break;
case 6:return 15
break;
case 7:return 16
break;
case 8:return 6
break;
case 9:return 17
break;
case 10:return 18
break;
case 11:return 5
break;
case 12:return 9
break;
}
},
rules: [/^(?:[a-zA-Z_0-9]+(:[a-za-zA-Z_0-9]+)?\b)/,/^(?:\.style1\b)/,/^(?:\.style2\b)/,/^(?:\.style3\b)/,/^(?:\.style4\b)/,/^(?:\.style5\b)/,/^(?:\{\{)/,/^(?:\}\})/,/^(?:\.newline\b)/,/^(?:\.hline\b)/,/^(?:>>>)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}

function EasyPrintTemplate(){
	print_text = '';
    this.render = render;
	this.result = result;
	this.setSource = setSource;
}

function render(){
    parser.parse(this.source);
}

function setSource(source,length,size = 1){
	print_text = '';
    this.source = source;
	lineLength = length;
	fontSize = size;
}

function result(){
    return print_text;
}
