var args = process.argv; //파일 실행시 입력값을 나타냄.
                        //conditional.js파일 실행을 위해 커맨드창에 'node syntax/conditional.js '을 입력하고 출력할 문자열을 뒤에 입력한다. 이 때, args는 node의 디렉토리(문자열), syntax/conditional.js의 디렉토리(문자열), 입력한 문자열 값을 차례대로 String 배열로 저장하게 된다. 그러므로 출력하고자 하는 문자열만 받기 위해서는 args[0],args[1]를 제외한 값을 선택해주어야 함.
console.log(args[2]);
console.log('A');
console.log('B');
if(args[2]==='1'){
  console.log('C1');
}else{
  console.log('C2');
}
console.log('D');
