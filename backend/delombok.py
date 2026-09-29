import os
import re

directories = [
    r"d:\urjatrack\backend\src\main\java\com\urjatrack\backend\domain",
    r"d:\urjatrack\backend\src\main\java\com\urjatrack\backend\dto"
]

def capitalize(s):
    return s[0].upper() + s[1:]

for d in directories:
    for f in os.listdir(d):
        if not f.endswith(".java"):
            continue
        filepath = os.path.join(d, f)
        with open(filepath, "r", encoding="utf-8") as file:
            content = file.read()
        
        if "lombok" not in content and "@Data" not in content:
            continue
            
        print(f"De-lomboking {filepath}")
        
        content = re.sub(r"import lombok\.[^;]+;\n?", "", content)
        
        class_match = re.search(r"public\s+class\s+(\w+)", content)
        if not class_match: continue
        class_name = class_match.group(1)
        
        has_no_args = "@NoArgsConstructor" in content or "@Data" in content
        has_all_args = "@AllArgsConstructor" in content
        
        content = re.sub(r"@Data\s*", "", content)
        content = re.sub(r"@NoArgsConstructor\s*", "", content)
        content = re.sub(r"@AllArgsConstructor\s*", "", content)
        
        field_pattern = re.compile(r"private\s+([\w<>,\s]+?)\s+(\w+)\s*;")
        fields = field_pattern.findall(content)
        
        methods = []
        
        if has_no_args:
            methods.append(f"    public {class_name}() {{}}\n")
            
        if has_all_args:
            args = ", ".join([f"{t} {n}" for t, n in fields])
            assignments = "\n".join([f"        this.{n} = {n};" for t, n in fields])
            methods.append(f"    public {class_name}({args}) {{\n{assignments}\n    }}\n")
            
        for t, n in fields:
            cap_n = capitalize(n)
            methods.append(f"    public {t} get{cap_n}() {{\n        return {n};\n    }}\n")
            methods.append(f"    public void set{cap_n}({t} {n}) {{\n        this.{n} = {n};\n    }}\n")
            
        last_brace_idx = content.rfind("}")
        if last_brace_idx != -1:
            content = content[:last_brace_idx] + "\n" + "\n".join(methods) + "}\n"
            
        with open(filepath, "w", encoding="utf-8") as file:
            file.write(content)
