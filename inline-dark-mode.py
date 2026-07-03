"""
Dark mode adaptation for inline-style components.
Strategy: Import { dark } from ThemeContext, replace hardcoded color values with dark() calls.

Components: Admin, MoodDiary, TreeHole, Games, Profile, Relax, WhiteNoise
"""
import os, re

BASE = r'C:\Users\GXQ\Documents\lingxi-claw\20260701-22-39-09-880\mind-ease\src'

def add_dark_import(filepath):
    """Add dark import from ThemeContext if not already present"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    import_line = "import { dark } from '../contexts/ThemeContext'"
    # Check if already has useTheme import (some components may)
    if '../contexts/ThemeContext' in content:
        # Already imports from ThemeContext, add dark to existing import
        content = re.sub(
            r"import\s*\{([^}]*)\}\s*from\s*'../contexts/ThemeContext'",
            lambda m: f"import {{ {m.group(1).strip()}, dark }} from '../contexts/ThemeContext'" if 'dark' not in m.group(1) else m.group(0),
            content
        )
    else:
        # Add new import after the last import statement
        lines = content.split('\n')
        last_import_idx = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import_idx = i
        if last_import_idx >= 0:
            lines.insert(last_import_idx + 1, import_line)
            content = '\n'.join(lines)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return content


def replace_inline_colors(content):
    """Replace hardcoded colors in style={{}} with dark() calls"""
    
    # Pattern: style={{ ... backgroundColor: '#fff', ... }}
    # We need to replace colors within style objects
    
    # Common background colors
    color_replacements = [
        ("backgroundColor: '#fff'", "backgroundColor: dark('#fff', '#1a1a2e')"),
        ("backgroundColor: '#ffffff'", "backgroundColor: dark('#ffffff', '#1a1a2e')"),
        ("backgroundColor: 'white'", "backgroundColor: dark('white', '#1a1a2e')"),
        ("backgroundColor: '#f5f3ff'", "backgroundColor: dark('#f5f3ff', '#2d2b55')"),
        ("backgroundColor: '#fdf4ff'", "backgroundColor: dark('#fdf4ff', '#3d2b3d')"),
        ("backgroundColor: '#ecfdf5'", "backgroundColor: dark('#ecfdf5', '#1a3328')"),
        ("backgroundColor: '#fef2f2'", "backgroundColor: dark('#fef2f2', '#2d1a1a')"),
        ("backgroundColor: '#fff7ed'", "backgroundColor: dark('#fff7ed', '#2d251a')"),
        ("backgroundColor: '#f0fdf4'", "backgroundColor: dark('#f0fdf4', '#1a2e1a')"),
        ("backgroundColor: '#fefce8'", "backgroundColor: dark('#fefce8', '#2d2d1a')"),
        ("backgroundColor: '#f9fafb'", "backgroundColor: dark('#f9fafb', '#1f2937')"),
        ("backgroundColor: '#f3f4f6'", "backgroundColor: dark('#f3f4f6', '#1f2937')"),
        ("backgroundColor: '#fef9c3'", "backgroundColor: dark('#fef9c3', '#2d2d1a')"),
        ("backgroundColor: '#e0e7ff'", "backgroundColor: dark('#e0e7ff', '#2a2d55')"),
        ("backgroundColor: '#ddd6fe'", "backgroundColor: dark('#ddd6fe', '#2a2640')"),
        
        # Card backgrounds
        ("backgroundColor: 'rgba(255,255,255,0.8)'", "backgroundColor: dark('rgba(255,255,255,0.8)', 'rgba(26,26,46,0.8)')"),
        ("backgroundColor: 'rgba(255,255,255,0.9)'", "backgroundColor: dark('rgba(255,255,255,0.9)', 'rgba(26,26,46,0.9)')"),
        ("backgroundColor: 'rgba(255,255,255,0.7)'", "backgroundColor: dark('rgba(255,255,255,0.7)', 'rgba(26,26,46,0.7)')"),
        ("backgroundColor: 'rgba(255,255,255,0.6)'", "backgroundColor: dark('rgba(255,255,255,0.6)', 'rgba(26,26,46,0.6)')"),
        ("backgroundColor: 'rgba(245,243,255,0.5)'", "backgroundColor: dark('rgba(245,243,255,0.5)', 'rgba(26,26,46,0.5)')"),
        ("backgroundColor: 'rgba(253,244,255,0.5)'", "backgroundColor: dark('rgba(253,244,255,0.5)', 'rgba(26,26,46,0.5)')"),
        
        # Text colors
        ("color: '#1f2937'", "color: dark('#1f2937', '#f3f4f6')"),
        ("color: '#374151'", "color: dark('#374151', '#d1d5db')"),
        ("color: '#4b5563'", "color: dark('#4b5563', '#9ca3af')"),
        ("color: '#6b7280'", "color: dark('#6b7280', '#9ca3af')"),
        ("color: '#9ca3af'", "color: dark('#9ca3af', '#6b7280')"),
        ("color: '#d1d5db'", "color: dark('#d1d5db', '#4b5563')"),
        ("color: '#111827'", "color: dark('#111827', '#f9fafb')"),
        ("color: '#1e293b'", "color: dark('#1e293b', '#e2e8f0')"),
        
        # Border colors
        ("borderColor: '#e5e7eb'", "borderColor: dark('#e5e7eb', '#374151')"),
        ("borderColor: '#f3f4f6'", "borderColor: dark('#f3f4f6', '#374151')"),
        ("borderColor: '#e9d5ff'", "borderColor: dark('#e9d5ff', '#4c1d95')"),
        ("borderColor: '#ede9fe'", "borderColor: dark('#ede9fe', '#3730a3')"),
        ("borderColor: '#ddd6fe'", "borderColor: dark('#ddd6fe', '#4c1d95')"),
        ("borderColor: '#fecaca'", "borderColor: dark('#fecaca', '#7f1d1d')"),
        ("borderColor: '#d1fae5'", "borderColor: dark('#d1fae5', '#064e3b')"),
        ("borderColor: '#e0e7ff'", "borderColor: dark('#e0e7ff', '#312e81')"),
        
        # Input/select backgrounds
        ("backgroundColor: '#f9fafb'", "backgroundColor: dark('#f9fafb', '#1f2937')"),
        ("backgroundColor: '#ffffff'", "backgroundColor: dark('#ffffff', '#1a1a2e')"),
        
        # SVG strokes (in style attributes)
        ("stroke: '#EDE9FE'", "stroke: dark('#EDE9FE', '#3730A3')"),
        ("stroke: '#ddd6fe'", "stroke: dark('#ddd6fe', '#4c1d95')"),
    ]
    
    for find, replace in color_replacements:
        content = content.replace(find, replace)
    
    return content


def process_component(filepath):
    """Process a single inline-style component"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count how many replacements will be made (for reporting)
    before = content
    
    # Add import
    content = add_dark_import(filepath)
    # Re-read since file was modified
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace inline colors
    content = replace_inline_colors(content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Report changes
    changes = sum(1 for a, b in [(before, content)] for i in range(len(a)) if a[i:i+10] != b[i:i+10])
    print(f"  Processed {filepath.split('\\\\')[-1]}")
    return content


# Process all inline-style components
components = [
    'pages/Admin.tsx',
    'pages/MoodDiary.tsx',
    'pages/TreeHole.tsx',
    'pages/Games.tsx',
    'pages/Profile.tsx',
    'pages/Relax.tsx',
    'components/WhiteNoise.tsx',
]

for comp in components:
    filepath = os.path.join(BASE, comp)
    if os.path.exists(filepath):
        process_component(filepath)
    else:
        print(f"  ⚠️ Not found: {comp}")

print("\n✅ All inline-style components processed!")
