var Parser = require('../src/algebra-parser.js'),
    algebra = require('algebra.js'),
    Expression = algebra.Expression,
    Equation = algebra.Equation;

describe("Input validity", function() {
    var p = new Parser();
    it("does not accept special characters", function(){
        var input = "2+4*x-€";
        expect(function(){p.parse(input);}).toThrow(new Error('Token error at character € at position 6'));
    });

    it("does not accept variable names with numbers", function(){
        var input = "2+4x";
        expect(p.parse(input)).toNotEqual(new Expression("4x").add(2));
    });

    it("does not accept operators without operands", function(){
        var input = "+";
         expect(function(){p.parse(input);}).toThrow(new Error('Missing operand'));
    });

    it("should ignore newlines", function(){
        var input = "2+z \n = 5";
        var lhs = new Expression("z").add(2);
        var rhs = new Expression(5);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should accept words as variable names", function(){
        var input = "2+alpha = 5";
        var lhs = new Expression("alpha").add(2);
        var rhs = new Expression(5);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should work from the algebra module", function(){
        var input = "2+alpha = 5";
        var lhs = new Expression("alpha").add(2);
        var rhs = new Expression(5);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should not accept incomplete decimal numbers", function(){
        var input = "2. + x * 4";
        expect(function(){p.parse(input);}).toThrow(new Error("Decimal point without decimal digits at position 1"));
    });

    it("should not accept short notation for decimals x with 0 > x < 1", function(){
        var input = ".2 + x * 4";
        expect(function(){p.parse(input);}).toThrow(new Error('Token error at character . at position 0'));
    });

    it("should treat decimal numbers correctly", function(){
        var input = "2.0 + 4.5";
        var expr = new Expression(13).divide(2);
        expect(p.parse(input)).toEqual(expr);
    });

    it("should treat decimal numbers correctly", function(){
        var input = "0.0";
        var expr = new Expression(0);
        expect(p.parse(input)).toEqual(expr);
    });

});

describe("Operators", function() {
    var p = new Parser();
    it("should parse = as equations", function(){
        var input = "2+x = 5";
        var lhs = new Expression("x").add(2);
        var rhs = new Expression(5);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should parse - correctly", function(){
        var input = "2-x = 5";
        var lhs = new Expression(2).subtract(new Expression("x"));
        var rhs = new Expression(5);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should parse / correctly", function(){
        var input = "x/2 = 8";
        var lhs = new Expression("x").divide(2);
        var rhs = new Expression(8);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });

    it("should parse / correctly", function(){
        var input = "x/5/3";
        var lhs = new Expression("x").divide(5).divide(3);
        expect(p.parse(input)).toEqual(lhs);
    });

    it("should parse ^ correctly", function(){
        var input = "x^2 = 16";
        var lhs = new Expression("x").pow(2);
        var rhs = new Expression(16);
        expect(p.parse(input)).toEqual(new Equation(lhs,rhs));
    });
});


describe("Parenthesis", function() {
    var p = new Parser();
    it("should parse and reduce parenthesis correctly", function(){
        var input = "(2)*((4)+((x)))";
        expect(p.parse(input)).toEqual(new Expression("x").add(4).multiply(2));
    });

    it("should throw an errow if there is an extra opening parenthesis", function(){
        var input = "2-(4*x";
        expect(function(){p.parse(input);}).toThrow(new Error('Unbalanced Parenthesis'));
    });

    it("should throw an errow if there is an extra closing parenthesis", function(){
        var input = "2+4*x)";
        expect(function(){p.parse(input);}).toThrow(new Error('Unbalanced Parenthesis'));
    });

});