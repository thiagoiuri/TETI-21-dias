const modules = import.meta.glob('../../firebase-*-config.json', { eager: true });
console.log(modules);
