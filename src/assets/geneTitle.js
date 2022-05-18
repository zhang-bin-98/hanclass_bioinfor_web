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
        name: 'log2FoldChange', 
        label: 'log2FoldChange', 
        field: 'log2FoldChange', 
        align: 'left', 
        sortable: true,
        format: v => Number(v).toFixed(2)
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

