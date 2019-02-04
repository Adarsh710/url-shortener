var s = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function b62encode(hashID){
    var hash_str = list();
    while (deci > 0){
        hash_str.append(s[deci % 62]);
        deci /= 62;
    }
    hash_str.reverse();
    return ''.join(hash_str);
}

function decode(text){
    var result = 0,i;
    for (i in range(0, len(text))){
            result += s.index(text[i]) * 62 ** (len(text) - 1 - i);
    }
    return result;
}

//"""the hash id must be 12 digits to generate 7 character short url"""
encode = base62(200097608738);
print(encode);
print(decode(encode));