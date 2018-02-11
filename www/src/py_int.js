;(function($B){

eval($B.InjectBuiltins())

var object = _b_.object, $N = _b_.None

function $err(op,other){
    var msg = "unsupported operand type(s) for "+op
    msg += ": 'int' and '"+$B.get_class(other).__name__+"'"
    throw _b_.TypeError.$factory(msg)
}

// dictionary for built-in class 'int'
var int = {__class__: $B.$type,
    __name__: 'int',
    __dir__: object.__dir__,
    $is_class: true,
    $native: true,
    $descriptors: {
        'numerator': true,
        'denominator': true,
        'imag': true,
        'real': true
    }
}

int.from_bytes = function() {
  var $=$B.args("from_bytes", 3,
      {bytes:null, byteorder:null, signed:null}, ['bytes', 'byteorder', 'signed'],
      arguments, {signed:False}, null, null)

  var x = $.bytes,
      byteorder = $.byteorder,
      signed = $.signed
  var _bytes, _len
  if (isinstance(x, [_b_.list, _b_.tuple])) {
     _bytes=x
     _len=len(x)
  } else if (isinstance(x, [_b_.bytes, _b_.bytearray])) {
    _bytes=x.source
    _len=x.source.length
  } else {
    _b_.TypeError.$factory("Error! " + _b_.type(x) + " is not supported in int.from_bytes. fix me!")
  }

  switch(byteorder) {
    case 'big':
      var num = _bytes[_len - 1];
      var _mult=256
      for (var i = (_len - 2); i >= 0; i--) {
          // For operations, use the functions that can take or return
          // big integers
          num = $B.add($B.mul(_mult, _bytes[i]), num)
          _mult = $B.mul(_mult,256)
      }
      if (!signed) return num
      if (_bytes[0] < 128) return num
      return $B.sub(num, _mult)
    case 'little':
      var num = _bytes[0]
      if (num >= 128) num = num - 256
      var _mult=256
      for (var i = 1;  i < _len; i++) {
          num = $B.add($B.mul(_mult, _bytes[i]), num)
          _mult = $B.mul(_mult,256)
      }
      if (!signed) return num
      if (_bytes[_len - 1] < 128) return num
      return $B.sub(num, _mult)
  }

  throw _b_.ValueError.$factory("byteorder must be either 'little' or 'big'");
}

int.to_bytes = function(length, byteorder, star) {
  //var len = x.length
  throw _b_.NotImplementedError.$factory("int.to_bytes is not implemented yet")
}


//int.__and__ = function(self,other){return self & other} // bitwise AND

int.__abs__ = function(self){return abs(self)}

int.__bool__ = function(self){return new Boolean(self.valueOf())}

int.__ceil__ = function(self){return Math.ceil(self)}

//is this a duplicate?
int.__class__ = $B.$type

int.__divmod__ = function(self, other){return divmod(self, other)}

int.__eq__ = function(self,other){
    // compare object "self" to class "int"
    if(other===undefined) return self===int
    if(isinstance(other,int)) return self.valueOf()==other.valueOf()
    if(isinstance(other,_b_.float)) return self.valueOf()==other.valueOf()
    if(isinstance(other,_b_.complex)){
      if (other.$imag != 0) return False
      return self.valueOf() == other.$real
    }

    if (hasattr(other, '__eq__')) return getattr(other, '__eq__')(self)

    return self.valueOf()===other
}

int.__float__ = function(self){
    return new Number(self)
}

function preformat(self, fmt){
    if(fmt.empty){return _b_.str.$factory(self)}
    if(fmt.type && 'bcdoxXn'.indexOf(fmt.type)==-1){
        throw _b_.ValueError.$factory("Unknown format code '"+fmt.type+
            "' for object of type 'int'")
    }

    switch(fmt.type){
        case undefined:
        case 'd':
            return self.toString()
        case 'b':
            return (fmt.alternate ? '0b' : '') + self.toString(2)
        case 'c':
            return _b_.chr(self)
        case 'o':
            return (fmt.alternate ? '0o' : '') + self.toString(8)
        case 'x':
            return (fmt.alternate ? '0x' : '') + self.toString(16)
        case 'X':
            return (fmt.alternate ? '0X' : '') + self.toString(16).toUpperCase()
        case 'n':
            return self // fix me
    }

    return res
}


int.__format__ = function(self,format_spec){
    var fmt = new $B.parse_format_spec(format_spec)
    if(fmt.type && 'eEfFgG%'.indexOf(fmt.type)!=-1){
        // Call __format__ on float(self)
        return _b_.float.__format__(self, format_spec)
    }
    fmt.align = fmt.align || '>'
    var res = preformat(self, fmt)
    if(fmt.comma){
        var sign = res[0]=='-' ? '-' : '',
            rest = res.substr(sign.length),
            len = rest.length,
            nb = Math.ceil(rest.length/3),
            chunks = []
        for(var i=0;i<nb;i++){
            chunks.push(rest.substring(len-3*i-3, len-3*i))
        }
        chunks.reverse()
        res = sign+chunks.join(',')
    }
    return $B.format_width(res, fmt)
}

int.__floordiv__ = function(self,other){
    if(isinstance(other,int)){
        if(other==0) throw ZeroDivisionError.$factory('division by zero')
        return Math.floor(self/other)
    }
    if(isinstance(other,_b_.float)){
        if(!other.valueOf()) throw ZeroDivisionError.$factory('division by zero')
        return Math.floor(self/other)
    }
    if(hasattr(other,'__rfloordiv__')){
        return getattr(other,'__rfloordiv__')(self)
    }
    $err("//",other)
}

int.__hash__ = function(self){
   if (self === undefined) {
      return int.__hashvalue__ || $B.$py_next_hash--  // for hash of int type (not instance of int)
   }

   return self.valueOf()
}

//int.__ior__ = function(self,other){return self | other} // bitwise OR

int.__index__ = function(self){return self}

int.__init__ = function(self,value){
    if(value===undefined){value=0}
    self.toString = function(){return value}
    //self.valueOf = function(){return value}
    return $N
}

int.__int__ = function(self){return self}

int.__invert__ = function(self){return ~self}

// bitwise left shift
int.__lshift__ = function(self,other){
    if(isinstance(other, int)){
        return int.$factory($B.long_int.__lshift__($B.long_int.$factory(self), $B.long_int.$factory(other)))
    }
    var rlshift = getattr(other, '__rlshift__', null)
    if(rlshift!==null){return rlshift(self)}
    $err('<<', other)
}

int.__mod__ = function(self,other) {
    // can't use Javascript % because it works differently for negative numbers
    if(isinstance(other,_b_.tuple) && other.length==1) other=other[0]
    if(isinstance(other,[int, _b_.float, bool])){
        if(other===false){other=0}else if(other===true){other=1}
        if(other==0){throw _b_.ZeroDivisionError.$factory(
            "integer division or modulo by zero")}
        return (self%other+other)%other
    }
    if(hasattr(other,'__rmod__')) return getattr(other,'__rmod__')(self)
    $err('%',other)
}

int.__mro__ = [object]

int.__mul__ = function(self,other){

    var val = self.valueOf()

    // this will be quick check, so lets do it early.
    if(typeof other==="string") {
        return other.repeat(val)
    }

    if(isinstance(other,int)){
        var res = self*other
        if(res>$B.min_int && res<$B.max_int){return res}
        else{return int.$factory($B.long_int.__mul__($B.long_int.$factory(self),
                $B.long_int.$factory(other)))}
    }
    if(isinstance(other,_b_.float)){
        return new Number(self*other)
    }
    if(isinstance(other,_b_.bool)){
         if (other.valueOf()) return self
         return int.$factory(0)
    }
    if(isinstance(other,_b_.complex)){
        return $B.make_complex(int.__mul__(self, other.$real),
            int.__mul__(self, other.$imag))
    }
    if(isinstance(other,[_b_.list,_b_.tuple])){
        var res = []
        // make temporary copy of list
        var $temp = other.slice(0,other.length)
        for(var i=0;i<val;i++) res=res.concat($temp)
        if(isinstance(other,_b_.tuple)) res=_b_.tuple.$factory(res)
        return res
    }
    if(hasattr(other,'__rmul__')) return getattr(other,'__rmul__')(self)
    $err("*",other)
}

int.__name__ = 'int'

int.__neg__ = function(self){return -self}

int.__new__ = function(cls){
    if(cls===undefined){throw _b_.TypeError.$factory('int.__new__(): not enough arguments')}
    return {__class__:cls.$factory ? cls : cls.$dict}
}

int.__pos__ = function(self){return self}

int.__pow__ = function(self,other,z){
    if(isinstance(other, int)) {
      switch(other.valueOf()) {
        case 0:
          return int.$factory(1)
        case 1:
          return int.$factory(self.valueOf())
      }
      if(z !== undefined && z !== null){
          // If z is provided, the algorithm is faster than computing
          // self ** other then applying the modulo z
          var res = (self % z + z) % z
          for(var i=1; i<other; i++){
              res *= self
              res = (res % z + z) % z
          }
          return res
      }
      var res = Math.pow(self.valueOf(),other.valueOf())
      if(res>$B.min_int && res<$B.max_int){return res}
      else if(res !== Infinity && !isFinite(res)){return res}
      else{
          return int.$factory($B.long_int.__pow__($B.long_int.$factory(self),
             $B.long_int.$factory(other)))
      }
    }
    if(isinstance(other, _b_.float)) {
        if(self>=0){return new Number(Math.pow(self, other.valueOf()))}
        else{
            // use complex power
            return _b_.complex.__pow__($B.make_complex(self, 0), other)
        }
    }else if(isinstance(other, _b_.complex)){
        var preal = Math.pow(self,  other.$real),
            ln = Math.log(self)
        return $B.make_complex(preal*Math.cos(ln), preal*Math.sin(ln))
    }
    if(hasattr(other,'__rpow__')) return getattr(other,'__rpow__')(self)
    $err("**",other)
}

int.__repr__ = function(self){
    if(self===int) return "<class 'int'>"
    return self.toString()
}

// bitwise right shift
int.__rshift__ = function(self,other){
    if(isinstance(other, int)){
        return int.$factory($B.long_int.__rshift__($B.long_int.$factory(self),
            $B.long_int.$factory(other)))
    }
    var rrshift = getattr(other, '__rrshift__', null)
    if(rrshift!==null){return rrshift(self)}
    $err('>>', other)
}

int.__setattr__ = function(self,attr,value){
    if(typeof self=="number"){
        if(int.$factory[attr]===undefined){
            throw _b_.AttributeError.$factory("'int' object has no attribute '"+attr+"'")
        }else{
            throw _b_.AttributeError.$factory("'int' object attribute '"+attr+"' is read-only")
        }
    }
    // subclasses of int can have attributes set
    self[attr] = value
    return $N
}

int.__str__ = int.__repr__

int.__truediv__ = function(self,other){
    if(isinstance(other,int)){
        if(other==0) throw ZeroDivisionError.$factory('division by zero')
        if(other.__class__==$B.long_int){return new Number(self/parseInt(other.value))}
        return new Number(self/other)
    }
    if(isinstance(other,_b_.float)){
        if(!other.valueOf()) throw ZeroDivisionError.$factory('division by zero')
        return new Number(self/other)
    }
    if(isinstance(other,_b_.complex)){
        var cmod = other.$real*other.$real+other.$imag*other.$imag
        if(cmod==0) throw ZeroDivisionError.$factory('division by zero')
        return $B.make_complex(self*other.$real/cmod,-self*other.$imag/cmod)
    }
    if(hasattr(other,'__rtruediv__')) return getattr(other,'__rtruediv__')(self)
    $err("/",other)
}

//int.__xor__ = function(self,other){return self ^ other} // bitwise XOR

int.bit_length = function(self){
    s = bin(self)
    s = getattr(s,'lstrip')('-0b') // remove leading zeros and minus sign
    return s.length       // len('100101') --> 6
}

// descriptors
int.numerator = function(self){return self}
int.denominator = function(self){return int.$factory(1)}
int.imag = function(self){return int.$factory(0)}
int.real = function(self){return self}


$B.max_int32= (1<<30) * 2 - 1
$B.min_int32= - $B.max_int32

// code for operands & | ^
var $op_func = function(self,other){
    if(isinstance(other,int)) {
        if(other.__class__===$B.long_int){
            return $B.long_int.__sub__($B.long_int.$factory(self), $B.long_int.$factory(other))
        }
        if (self > $B.max_int32 || self < $B.min_int32 ||
            other > $B.max_int32 || other < $B.min_int32) {
            return $B.long_int.__sub__($B.long_int.$factory(self), $B.long_int.$factory(other))
        }
        return self-other
    }
    if(isinstance(other,_b_.bool)) return self-other
    if(hasattr(other,'__rsub__')) return getattr(other,'__rsub__')(self)
    $err("-",other)
}

$op_func += '' // source code
var $ops = {'&':'and','|':'or','^':'xor'}
for(var $op in $ops){
    var opf = $op_func.replace(/-/gm,$op)
    opf = opf.replace(new RegExp('sub','gm'),$ops[$op])
    eval('int.__'+$ops[$op]+'__ = '+opf)
}

// code for + and -
var $op_func = function(self,other){
    if(isinstance(other,int)){
        if(typeof other=='number'){
            var res = self.valueOf()-other.valueOf()
            if(res>=$B.min_int && res<=$B.max_int){return res}
            else{return $B.long_int.__sub__($B.long_int.$factory(self),
                $B.long_int.$factory(other))}
        }else if(typeof other=="boolean"){
            return other ? self-1 : self
        }else{
            return $B.long_int.__sub__($B.long_int.$factory(self),
                $B.long_int.$factory(other))
        }
    }
    if(isinstance(other,_b_.float)){
        return new Number(self-other)
    }
    if(isinstance(other,_b_.complex)){
        return $B.make_complex(self-other.$real,-other.$imag)
    }
    if(isinstance(other,_b_.bool)){
         var bool_value=0;
         if(other.valueOf()) bool_value=1;
         return self-bool_value
    }
    if(isinstance(other,_b_.complex)){
        return $B.make_complex(self.valueOf() - other.$real, other.$imag)
    }
    if(hasattr(other,'__rsub__')) return getattr(other,'__rsub__')(self)
    throw $err('-',other)
}
$op_func += '' // source code
var $ops = {'+':'add','-':'sub'}
for(var $op in $ops){
    var opf = $op_func.replace(/-/gm,$op)
    opf = opf.replace(new RegExp('sub','gm'),$ops[$op])
    eval('int.__'+$ops[$op]+'__ = '+opf)
}

// comparison methods
var $comp_func = function(self,other){
    if (other.__class__ === $B.long_int) {
        return $B.long_int.__lt__(other, $B.long_int.$factory(self))
    }
    if(isinstance(other,int)) return self.valueOf() > other.valueOf()
    if(isinstance(other,_b_.float)) return self.valueOf() > other.valueOf()
    if(isinstance(other,_b_.bool)) {
      return self.valueOf() > _b_.bool.__hash__(other)
    }
    if (hasattr(other, '__int__') || hasattr(other, '__index__')) {
       return int.__gt__(self, $B.$GetInt(other))
    }

    // See if other has the opposite operator, eg < for >
    var inv_op = getattr(other, '__lt__', null)
    if(inv_op !== null){return inv_op(self)}

    throw _b_.TypeError.$factory(
        "unorderable types: int() > "+$B.get_class(other).__name__+"()")
}
$comp_func += '' // source code

for(var $op in $B.$comps){
    eval("int.__"+$B.$comps[$op]+'__ = '+
          $comp_func.replace(/>/gm,$op).
              replace(/__gt__/gm,'__'+$B.$comps[$op]+'__').
              replace(/__lt__/, '__'+$B.$inv_comps[$op]+'__'))
}

// add "reflected" methods
$B.make_rmethods(int)

var $valid_digits=function(base) {
    var digits=''
    if (base === 0) return '0'
    if (base < 10) {
       for (var i=0; i < base; i++) digits+=String.fromCharCode(i+48)
       return digits
    }

    var digits='0123456789'
    // A = 65 (10 + 55)
    for (var i=10; i < base; i++) digits+=String.fromCharCode(i+55)
    return digits
}

int.$factory = function(value, base){
    // int() with no argument returns 0
    if(value===undefined){return 0}

    // int() of an integer returns the integer if base is undefined
    if(typeof value=='number' &&
        (base===undefined || base==10)){return parseInt(value)}

    if(base!==undefined){
        if(!isinstance(value,[_b_.str,_b_.bytes,_b_.bytearray])){
            throw TypeError.$factory("int() can't convert non-string with explicit base")
        }
    }

    if(isinstance(value,_b_.complex)){
        throw TypeError.$factory("can't convert complex to int")
    }

    var $ns=$B.args('int',2,{x:null,base:null},['x','base'],arguments,
        {'base':10},'null','null')
    var value = $ns['x']
    var base = $ns['base']

    if(isinstance(value, _b_.float) && base===10){
        if(value<$B.min_int || value>$B.max_int){
            return $B.long_int.$from_float(value)
        }
        else{return value>0 ? Math.floor(value) : Math.ceil(value)}
    }

    if (!(base >=2 && base <= 36)) {
        // throw error (base must be 0, or 2-36)
        if (base != 0) throw _b_.ValueError.$factory("invalid base")
    }

    if (typeof value == 'number'){

        if(base==10){
           if(value < $B.min_int || value > $B.max_int) return $B.long_int.$factory(value)
           return value
        }else if(value.toString().search('e')>-1){
            // can't convert to another base if value is too big
            throw _b_.OverflowError.$factory("can't convert to base "+base)
        }else{
            var res=parseInt(value, base)
            if(res < $B.min_int || res > $B.max_int) return $B.long_int.$factory(value,base)
            return res
        }
    }

    if(value===true) return Number(1)
    if(value===false) return Number(0)
    if(value.__class__===$B.long_int){
        var z = parseInt(value.value)
        if(z>$B.min_int && z<$B.max_int){return z}
        else{return value}
    }

    base=$B.$GetInt(base)

    if(isinstance(value, _b_.str)) value=value.valueOf()
    if(typeof value=="string") {
      var _value=value.trim()    // remove leading/trailing whitespace
      if (_value.length == 2 && base==0 && (_value=='0b' || _value=='0o' || _value=='0x')) {
         throw _b_.ValueError.$factory('invalid value')
      }
      if (_value.length >2) {
         var _pre=_value.substr(0,2).toUpperCase()
         if (base == 0) {
            if (_pre == '0B') base=2
            if (_pre == '0O') base=8
            if (_pre == '0X') base=16
         }
         if (_pre=='0B' || _pre=='0O' || _pre=='0X') {
            _value=_value.substr(2)
         }
      }
      var _digits=$valid_digits(base)
      var _re=new RegExp('^[+-]?['+_digits+']+$', 'i')
      if(!_re.test(_value)) {
         throw _b_.ValueError.$factory(
             "invalid literal for int() with base "+base +": '"+
             _b_.str.$factory(value)+"'")
      }
      if(base <= 10 && !isFinite(value)) {
         throw _b_.ValueError.$factory(
             "invalid literal for int() with base "+base +": '"+
             _b_.str.$factory(value)+"'")
      }
      var res=parseInt(_value, base)
      if(res < $B.min_int || res > $B.max_int) return $B.long_int.$factory(_value, base)
      return res
    }

    if(isinstance(value,[_b_.bytes,_b_.bytearray])){
        var _digits = $valid_digits(base)
        for(var i=0;i<value.source.length;i++){
            if(_digits.indexOf(String.fromCharCode(value.source[i]))==-1){
                throw _b_.ValueError.$factory("invalid literal for int() with base "+
                    base +": "+_b_.repr(value))
            }
        }
        return Number(parseInt(getattr(value,'decode')('latin-1'), base))
    }

    if(hasattr(value, '__int__')) return getattr(value,'__int__')()
    if(hasattr(value, '__index__')) return getattr(value,'__index__')()
    if(hasattr(value, '__trunc__')) {
        var res = getattr(value,'__trunc__')(),
            int_func = _b_.getattr(res, '__int__', null)
        if(int_func===null){
            throw TypeError.$factory('__trunc__ returned non-Integral (type '+
                $B.get_class(res).__name__+')')
        }
        var res=int_func()
        if(isinstance(res, int)){return res}
        throw TypeError.$factory('__trunc__ returned non-Integral (type '+
                $B.get_class(res).__name__+')')
    }
    throw _b_.TypeError.$factory("int() argument must be a string, a bytes-like "+
        "object or a number, not '"+$B.get_class(value).__name__+"'")
}

$B.set_func_names(int, "builtins")

_b_.int = int

// Boolean type
$B.$bool = function(obj){ // return true or false
    if(obj===null || obj === undefined ) return false
    switch(typeof obj) {
      case 'boolean':
        return obj
      case 'number':
      case 'string':
        if(obj) return true
        return false
      default:
        var ce = $B.current_exception
        try{return getattr(obj,'__bool__')()}
        catch(err){
            $B.current_exception = ce
            try{return getattr(obj,'__len__')()>0}
            catch(err){return true}
        }
    }// switch
}

var bool = {
    __class__: $B.$type,
    __module__: "builtins",
    __mro__: [int, object],
    __name__: "bool",
    $is_class: true,
    $native: true
}

bool.__add__ = function(self,other){
    return (other ? 1 : 0)+(self ? 1 : 0)
}

bool.__and__ = function(self, other){
    return $B.$bool(int.__and__(self, other))
}

bool.__eq__ = function(self,other){
    return self ? $B.$bool(other) : !$B.$bool(other)
}

bool.__ne__ = function(self,other){
    return self ? !$B.$bool(other) : $B.$bool(other)
}

bool.__ge__ = function(self,other){
    return _b_.int.__ge__(bool.__hash__(self),other)
}

bool.__gt__ = function(self,other){
    return _b_.int.__gt__(bool.__hash__(self),other)
}

bool.__hash__ = bool.__index__= bool.__int__=function(self) {
   if(self.valueOf()) return 1
   return 0
}

bool.__le__ = function(self,other){return !bool.__gt__(self,other)}

bool.__lshift__ = function(self,other){return self.valueOf() << other}

bool.__lt__ = function(self,other){return !bool.__ge__(self,other)}

bool.__mul__ = function(self,other){
    return self ? other : 0
}

bool.__neg__ = function(self){return -$B.int_or_bool(self)}

bool.__or__ = function(self, other){
    return $B.$bool(int.__or__(self, other))
}

bool.__pos__ = $B.int_or_bool

bool.__repr__ = bool.__str__ = function(self){
    return self ? "True" : "False"
}

bool.__setattr__ = function(self, attr){
    return no_set_attr(bool, attr)
}

bool.__sub__ = function(self,other){
    return (self ? 1 : 0) - (other ? 1 : 0)
}

bool.__xor__ = function(self, other) {
    return self.valueOf() != other.valueOf()
}

bool.$factory = function(){
    // Calls $B.$bool, which is used inside the generated JS code and skips
    // arguments control.
    var $=$B.args('bool', 1, {x:null}, ['x'], arguments,{x:false},null,null)
    return $B.$bool($.x)
}

_b_.bool = bool

$B.set_func_names(bool, "builtins")

})(__BRYTHON__)
