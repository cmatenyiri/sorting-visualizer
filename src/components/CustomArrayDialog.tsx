import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { parseCustomArray } from '../engine/arrays';

const EXAMPLES: [string, string][] = [
  ['Textbook', '38, 27, 43, 3, 9, 82, 10'],
  ['Duplicates', '5, 1, 4, 2, 8, 5, 1, 4, 2, 8'],
  ['Organ pipes', '10, 30, 50, 70, 90, 80, 60, 40, 20'],
  ['Radix showcase', '170, 45, 75, 90, 802, 24, 2, 66'],
];

interface CustomArrayDialogProps {
  open: boolean;
  initial: readonly number[];
  onClose: () => void;
  onApply: (values: number[]) => void;
}

export function CustomArrayDialog({ open, initial, onClose, onApply }: CustomArrayDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Mounted only while open so the draft resets every time the dialog opens. */}
      {open && <CustomArrayForm initial={initial} onClose={onClose} onApply={onApply} />}
    </Dialog>
  );
}

function CustomArrayForm({ initial, onClose, onApply }: Omit<CustomArrayDialogProps, 'open'>) {
  const [text, setText] = useState(() => initial.join(', '));
  const [touched, setTouched] = useState(false);
  const result = parseCustomArray(text);
  const error = 'error' in result ? result.error : null;

  const submit = () => {
    setTouched(true);
    if ('values' in result) {
      onApply(result.values);
      onClose();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        <Typography variant="eyebrow" component="div" sx={{ color: 'text.secondary' }}>
          Custom input
        </Typography>
        <Typography variant="h5" component="span">
          Sort your own numbers
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Enter 2–200 whole numbers between 1 and 999, separated by commas or spaces.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched && Boolean(error)}
          helperText={
            touched && error ? error : 'values' in result ? `${result.values.length} numbers` : ' '
          }
          slotProps={{ htmlInput: { 'aria-label': 'Numbers to sort', spellCheck: false } }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
          {EXAMPLES.map(([label, values]) => (
            <Chip
              key={label}
              label={label}
              size="small"
              variant="outlined"
              onClick={() => setText(values)}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={touched && Boolean(error)}>
          Use these numbers
        </Button>
      </DialogActions>
    </Box>
  );
}
