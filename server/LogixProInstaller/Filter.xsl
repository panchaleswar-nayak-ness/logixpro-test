<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:wix="http://wixtoolset.org/schemas/v4/wxs">

	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" />

	<!-- Deep copy everything else -->
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" />
		</xsl:copy>
	</xsl:template>

	<!-- Remove the Windows Service PickProApi.exe file from the list of auto-generated components -->
	<xsl:template match="wix:Component[wix:File[contains(@Source, 'LogixPro.exe')]]" />
	<xsl:template match="wix:ComponentRef[@Id=//wix:Component[wix:File[contains(@Source, 'LogixPro.exe')]]/@Id]">
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="wix:Component[wix:File[contains(@Source, 'appsettings.Development.json')]]" />
	<xsl:template match="wix:ComponentRef[@Id=//wix:Component[wix:File[contains(@Source, 'appsettings.Development.json')]]/@Id]">
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="wix:Component[wix:File[contains(@Source, 'nuget.config')]]" />
	<xsl:template match="wix:ComponentRef[@Id=//wix:Component[wix:File[contains(@Source, 'nuget.config')]]/@Id]">
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="wix:Component[wix:File[contains(@Source, '.pdb')]]" />
	<xsl:template match="wix:ComponentRef[@Id=//wix:Component[wix:File[contains(@Source, '.pdb')]]/@Id]">
		<xsl:apply-templates />
	</xsl:template>

</xsl:stylesheet>
