import json

path = r'C:\Users\pc\Downloads\btl\badtheorylab\notebooks\collab-training.ipynb'
with open(path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

code_cells = [c for c in nb['cells'] if c['cell_type'] == 'code']

for cell in code_cells:
    src = ''.join(cell['source'])

    # Batch size for A100 80GB
    if 'train_batch_size = 4' in src:
        src = src.replace('train_batch_size = 4', 'train_batch_size = 8')

    if 'eval_batch_size = 16' in src:
        src = src.replace('eval_batch_size = 16', 'eval_batch_size = 32')

    # SDPA (built-in, no flash-attn needed)
    if 'quantization_config=bnb_config,' in src:
        src = src.replace(
            'quantization_config=bnb_config,',
            'quantization_config=bnb_config,\n    attn_implementation="sdpa",'
        )

    cell['source'] = src.splitlines(True)

    # Fix output_dir to persistent path
    if 'output_dir=' in src:
        src = src.replace(
            'output_dir=str(artifact_dir / "trainer"),',
            'output_dir="/home/zeus/btl-1/checkpoints",'
        )
        cell['source'] = src.splitlines(True)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

print('lightning config applied')
