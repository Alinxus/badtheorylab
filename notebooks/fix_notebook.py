import json

path = r'C:\Users\pc\Downloads\btl\badtheorylab\notebooks\collab-training.ipynb'
with open(path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

code_cells = [c for c in nb['cells'] if c['cell_type'] == 'code']

for cell in code_cells:
    src = ''.join(cell['source'])

    if 'train_batch_size = 1' in src:
        src = src.replace('train_batch_size = 1', 'train_batch_size = 4')
        print('train_batch_size: 1 -> 4')

    if 'grad_accum = 8' in src:
        src = src.replace('grad_accum = 8', 'grad_accum = 2')
        print('grad_accum: 8 -> 2')

    if 'evaluation_strategy="steps"' in src:
        src = src.replace('evaluation_strategy="steps",\n    ', '')
        print('removed evaluation_strategy')

    if 'eval_steps=200,' in src:
        src = src.replace('eval_steps=200,\n    ', '')
        print('removed eval_steps')

    if 'eval_dataset=eval_tok,' in src:
        src = src.replace('eval_dataset=eval_tok,\n    ', '')
        print('removed eval_dataset from Trainer')

    cell['source'] = src.splitlines(True)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

print('notebook updated')
