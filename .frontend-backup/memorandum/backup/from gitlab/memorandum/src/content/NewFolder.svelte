<script>

</script>


<section id="newFolder" on:click>
    <p>New Folder</p>
    <p>+</p>
</section>


<style type="text/scss">
    @import './_mixins.scss';
    @import './_variables.scss';

    section {
        display: flex;
        height: calc(100% - 40px);
        margin: $defPadding;
        border: solid 3px $darkgrey80;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: $black30;

        &:hover {
            box-shadow: 0 0 20px $white30;
        }

        p {
            color: white;
            text-shadow: 0 0 5px $white30;
            font-size: 50px;
            margin: 0;
            padding: 0;
        }
    }

    :global(body.light-theme) #newFolder {
        background-color: $white30;
        border: solid 3px $lightgrey80;
    }
</style>