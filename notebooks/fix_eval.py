import json

path = r'C:\Users\pc\Downloads\btl\badtheorylab\notebooks\collab-training.ipynb'
with open(path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

code_cells = [c for c in nb['cells'] if c['cell_type'] == 'code']

for cell in code_cells:
    src = ''.join(cell['source'])

    # Add eval args to TrainingArguments
    if 'training_args = TrainingArguments(' in src:
        insert = (
            '    eval_strategy="steps",\n'
            '    eval_steps=500,\n'
            '    save_strategy="steps",\n'
            '    save_steps=500,\n'
            '    load_best_model_at_end=True,\n'
            '    metric_for_best_model="eval_loss",\n'
        )
        src = src.replace(
            '    gradient_accumulation_steps=grad_accum,',
            '    gradient_accumulation_steps=grad_accum,\n' + insert
        )
        cell['source'] = src.splitlines(True)
        print('added eval args')

    # Add eval_dataset back to Trainer
    if 'trainer = Trainer(' in src and 'eval_dataset' not in src:
        src = src.replace(
            '    train_dataset=train_tok,',
            '    train_dataset=train_tok,\n    eval_dataset=eval_tok,'
        )
        cell['source'] = src.splitlines(True)
        print('added eval_dataset to Trainer')

with open(path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

print('done')
