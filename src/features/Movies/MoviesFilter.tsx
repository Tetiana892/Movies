import { FilterAltOffOutlined } from "@mui/icons-material";
import { Autocomplete, Button, FormControl, Paper, TextField, debounce } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { KeywordsItem, client } from "../../api/tmdb";
import { useMemo, useState } from "react";

export interface Filters {
  keywords: KeywordsItem[];
}

interface MoviesFilterProps {
  onApply(filters: Filters): void;
}

export function MoviesFilter({ onApply }: MoviesFilterProps) {
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [keywordsOptions, setKeywordsOptions] = useState<KeywordsItem[]>([]);
  const { handleSubmit, control } = useForm<Filters>({
    defaultValues: {
      keywords: [],
    },
  });

  const fetchKeywords = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query) {
          setKeywordsLoading(true);

          const options = await client.getKeywords(query);
          setKeywordsLoading(false);
          setKeywordsOptions(options);
        } else {
          setKeywordsOptions([]);
        }
      }, 1000),
    []
  );

  return (
    <Paper sx={{ m: 2, p: 0.5 }}>
      <form onSubmit={handleSubmit(onApply)}>
        <FormControl component="fieldset" variant="standard" sx={{ m: 2, display: "block" }}>
          <Controller
            name="keywords"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                disablePortal
                loading={keywordsLoading}
                options={keywordsOptions}
                filterOptions={(x) => x}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => onChange(value)}
                value={value}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} label="Keywords" />}
                onInputChange={(_, value) => fetchKeywords(value)}
              />
            )}
          />
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          startIcon={<FilterAltOffOutlined />}
          sx={{ m: 2 }}
        >
          Apply filter
        </Button>
      </form>
    </Paper>
  );
}
