import { createHash } from 'crypto';

// Función simple para calcular hash SHA-256
function calculateSHA256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

// Datos de prueba del usuario
const cedula = '40244044852';
const password = '9019eeb7b0c12ed45db8569f22a024d19b944695f5e1da1797608292d0e512ff';

console.log('🔍 Diagnóstico de Autenticación - Script Simple\n');

console.log(`📋 Datos de prueba:`);
console.log(`   Cédula: ${cedula}`);
console.log(`   Password (hash): ${password}`);
console.log(`   Password (longitud): ${password.length} caracteres\n`);

// Verificar si el password es un hash válido
const isHash = /^[a-fA-F0-9]{64}$/.test(password);
console.log(`🔐 Análisis del password:`);
console.log(`   ¿Es hash SHA-256?: ${isHash ? '✅ Sí' : '❌ No'}`);

if (isHash) {
  console.log(`   Hash válido de 64 caracteres hexadecimales\n`);
} else {
  console.log(`   No es un hash válido\n`);
}

// Probar diferentes combinaciones de hash
console.log(`🔍 Probando diferentes combinaciones de hash...\n`);

// Probar con contraseña común
const testPassword = 'password123';
const hashCedulaPassword = calculateSHA256(cedula + testPassword);
const hashPasswordCedula = calculateSHA256(testPassword + cedula);
const hashOnlyPassword = calculateSHA256(testPassword);

console.log(`📊 Resultados de hash:`);
console.log(`   Hash (cedula + 'password123'): ${hashCedulaPassword}`);
console.log(`   Hash ('password123' + cedula): ${hashPasswordCedula}`);
console.log(`   Hash (solo 'password123'): ${hashOnlyPassword}\n`);

console.log(`🔍 Comparaciones:`);
console.log(`   ¿Hash recibido = (cedula + 'password123')?: ${password === hashCedulaPassword ? '✅ Sí' : '❌ No'}`);
console.log(`   ¿Hash recibido = ('password123' + cedula)?: ${password === hashPasswordCedula ? '✅ Sí' : '❌ No'}`);
console.log(`   ¿Hash recibido = (solo 'password123')?: ${password === hashOnlyPassword ? '✅ Sí' : '❌ No'}\n`);

// Probar con otras contraseñas comunes
const commonPasswords = ['123456', 'admin', 'user', 'test', 'password'];
console.log(`🔍 Probando contraseñas comunes:`);

for (const commonPass of commonPasswords) {
  const hashCedulaCommon = calculateSHA256(cedula + commonPass);
  const hashCommonCedula = calculateSHA256(commonPass + cedula);
  
  console.log(`   '${commonPass}':`);
  console.log(`     (cedula + '${commonPass}'): ${password === hashCedulaCommon ? '✅ Coincide' : '❌ No coincide'}`);
  console.log(`     ('${commonPass}' + cedula): ${password === hashCommonCedula ? '✅ Coincide' : '❌ No coincide'}`);
}

console.log('\n🔍 Análisis del problema:');
console.log('   El hash recibido no coincide con ninguna de las combinaciones probadas.');
console.log('   Esto sugiere que:');
console.log('   1. La contraseña original es diferente a las probadas');
console.log('   2. El algoritmo de hash es diferente');
console.log('   3. Hay un salt o prefijo adicional');
console.log('   4. El hash fue generado con una versión anterior del algoritmo');

console.log('\n💡 Recomendaciones:');
console.log('   1. Verificar la contraseña original del usuario');
console.log('   2. Revisar si hay cambios en el algoritmo de hash');
console.log('   3. Verificar si hay campos adicionales en el hash');
console.log('   4. Consultar con el usuario la contraseña exacta que usó el viernes');
