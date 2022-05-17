import { format } from "echarts";

export const columns = [
    {
        name: 'gene_id', 
        label: 'gene_id', 
        field: 'gene_id', 
        align: 'left', 
        sortable: true
    },
    {
        name: 'gene_name', 
        label: 'gene_name', 
        field: 'gene_name', 
        align: 'left', 
        sortable: true
    },
    {
        name: 'log2_fold_change', 
        label: 'log2_fold_change', 
        field: 'log2_fold_change', 
        align: 'left', 
        sortable: true,
        format: v => Number(v).toFixed(2),
        classes: r => r.padj < 0.05 && r.log2_fold_change > 0.5
            ? "text-red"
            : r.padj < 0.05 && r.log2_fold_change < -0.5
            ? "text-green"
            : "text-grey"
    },
    {
        name: 'pvalue', 
        label: 'pvalue', 
        field: 'pvalue', 
        align: 'left', 
        sortable: true,
        format: v => Number(v).toFixed(2)
    },
    {
        name: 'padj', 
        label: 'padj', 
        field: 'padj', 
        align: 'left', 
        sortable: true,
        format: v => Number(v).toFixed(2)
    }
]

