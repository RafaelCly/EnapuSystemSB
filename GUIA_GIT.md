# 🚀 GUÍA DE GIT PARA COLABORADORES - PROYECTO ENAPU

## 📌 CLONAR EL REPOSITORIO (Primera vez)

```bash
git clone https://github.com/RafaelCly/ENAPUU.git
cd ENAPUU
```

---

## 🔄 MANTENER TU COPIA ACTUALIZADA

Antes de empezar a trabajar cada día, actualiza tu copia local:

```bash
# Ver en qué rama estás
git status

# Traer los últimos cambios del repositorio
git pull origin main
```

---

## 💾 GUARDAR TUS CAMBIOS (Commit)

### Paso 1: Ver qué archivos modificaste

```bash
git status
```

### Paso 2: Agregar archivos al área de staging

```bash
# Agregar todos los archivos modificados
git add .

# O agregar archivos específicos
git add src/pages/operator/NewFile.tsx
git add backend/core/models.py
```

### Paso 3: Hacer commit con un mensaje descriptivo

```bash
git commit -m "feat: Descripción breve de los cambios"
```

#### 📝 Convenciones de mensajes de commit:

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `feat:` | Nueva funcionalidad | `feat: Agregar búsqueda de contenedores` |
| `fix:` | Corrección de bug | `fix: Corregir error en login` |
| `refactor:` | Refactorización de código | `refactor: Mejorar estructura de API` |
| `docs:` | Cambios en documentación | `docs: Actualizar README` |
| `style:` | Cambios de formato | `style: Formatear código con prettier` |
| `test:` | Agregar o modificar tests | `test: Agregar tests para tickets` |

### Paso 4: Subir tus cambios al repositorio

```bash
git push origin main
```

---

## 🌿 TRABAJAR CON RAMAS (Recomendado)

### Crear una rama para tu tarea

```bash
# Crear y cambiar a una nueva rama
git checkout -b feature/mi-nueva-funcionalidad

# Ver todas las ramas
git branch
```

### Trabajar en tu rama

```bash
# Hacer cambios...
# Agregar archivos
git add .

# Commit
git commit -m "feat: Mi nueva funcionalidad"

# Subir tu rama al repositorio
git push origin feature/mi-nueva-funcionalidad
```

### Fusionar tu rama con main

```bash
# Cambiar a main
git checkout main

# Actualizar main
git pull origin main

# Fusionar tu rama
git merge feature/mi-nueva-funcionalidad

# Subir los cambios
git push origin main

# Eliminar la rama local (opcional)
git branch -d feature/mi-nueva-funcionalidad

# Eliminar la rama remota (opcional)
git push origin --delete feature/mi-nueva-funcionalidad
```

---

## 🔥 COMANDOS ÚTILES EN CASO DE PROBLEMAS

### Descartar cambios locales no guardados

```bash
# Descartar cambios en un archivo específico
git checkout -- src/pages/operator/MyFile.tsx

# Descartar todos los cambios no guardados
git reset --hard HEAD
```

### Ver el historial de commits

```bash
# Ver lista de commits
git log

# Ver commits con formato corto
git log --oneline

# Ver últimos 5 commits
git log -5
```

### Ver diferencias antes de commit

```bash
# Ver cambios en archivos modificados
git diff

# Ver cambios en archivos en staging
git diff --staged
```

### Sincronizar con el repositorio remoto

```bash
# Si alguien hizo push antes que tú
git pull --rebase origin main
git push origin main
```

### Resolver conflictos de merge

Si hay conflictos al hacer `git pull`:

1. Git marcará los archivos con conflicto
2. Abre esos archivos y busca:
   ```
   <<<<<<< HEAD
   Tu código
   =======
   Código del repositorio
   >>>>>>> origin/main
   ```
3. Edita el archivo para resolver el conflicto
4. Guarda los cambios
5. Ejecuta:
   ```bash
   git add .
   git commit -m "fix: Resolver conflictos de merge"
   git push origin main
   ```

---

## 📋 FLUJO DE TRABAJO RECOMENDADO PARA EL EQUIPO

### Opción 1: Trabajo directo en `main` (Proyectos pequeños)

```bash
# 1. Actualizar tu copia local
git pull origin main

# 2. Hacer cambios en tu código...

# 3. Verificar cambios
git status
git diff

# 4. Agregar y commit
git add .
git commit -m "feat: Descripción de los cambios"

# 5. Subir cambios
git push origin main
```

### Opción 2: Trabajo con ramas (Proyectos grandes)

```bash
# 1. Actualizar main
git checkout main
git pull origin main

# 2. Crear rama para tu tarea
git checkout -b feature/nombre-descriptivo

# 3. Hacer cambios...

# 4. Commit en tu rama
git add .
git commit -m "feat: Descripción"

# 5. Subir tu rama
git push origin feature/nombre-descriptivo

# 6. Crear Pull Request en GitHub

# 7. Después de aprobación, fusionar en main
git checkout main
git pull origin main
git merge feature/nombre-descriptivo
git push origin main
```

---

## ⚠️ ARCHIVOS QUE NO SE DEBEN SUBIR

Estos archivos están en `.gitignore` y NO se subirán automáticamente:

- ❌ `backend/.env` (contraseñas)
- ❌ `node_modules/` (dependencias Node)
- ❌ `venv/` (entorno virtual Python)
- ❌ `db.sqlite3` (base de datos local)
- ❌ `__pycache__/` (archivos temporales Python)
- ❌ `.vscode/` (configuración del editor)

---

## 🆘 COMANDOS DE EMERGENCIA

### Olvidé hacer pull antes de modificar código

```bash
# Guardar tus cambios temporalmente
git stash

# Actualizar con el repositorio
git pull origin main

# Recuperar tus cambios
git stash pop
```

### Quiero deshacer el último commit (pero mantener cambios)

```bash
git reset HEAD~1
```

### Quiero deshacer el último commit (y perder cambios)

```bash
git reset --hard HEAD~1
```

### Quiero ver qué cambió en un commit específico

```bash
# Ver cambios del último commit
git show HEAD

# Ver cambios de un commit específico
git show abc1234
```

---

## 📊 BUENAS PRÁCTICAS

✅ **HACER:**

- Hacer commits frecuentes y pequeños
- Usar mensajes descriptivos
- Hacer `git pull` antes de empezar a trabajar
- Revisar `git status` antes de commit
- Probar tu código antes de push

❌ **NO HACER:**

- Subir archivos con contraseñas o datos sensibles
- Hacer commits gigantes con muchos cambios
- Hacer push sin probar el código
- Modificar el historial de commits públicos
- Trabajar directamente en main sin coordinación

---

## 🔗 RECURSOS ADICIONALES

- [Documentación oficial de Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

## 💡 TIPS FINALES

1. **Comunica con tu equipo:** Antes de hacer cambios grandes, avisa al equipo
2. **Revisa antes de push:** Usa `git diff` para ver qué estás subiendo
3. **Commits atómicos:** Cada commit debe tener un propósito claro
4. **Branches descriptivas:** `feature/nueva-busqueda` es mejor que `mi-rama`
5. **Pull requests:** Úsalas para revisar código en equipo

---

**Última actualización:** 11 de noviembre de 2025
**Repositorio:** https://github.com/RafaelCly/ENAPUU
