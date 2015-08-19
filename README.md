#Note:
This parser was integrated into the algebra.js library. 
There should be no reason to use this module except you just want to.

#Usage

Create a parser object and pass the equation or expression to the 'parse' 
method. According to the input it returns an Equation or Expression object from
the algebra.js module:

```javascript
var Parser = require('algebra-parser');

var p = new Parser();
var eq = p.parse("x^2 + 4 * x = 16");
```

#Demo
I put a demo online, [check it out](http://timrach.github.io/algebra-parser/)
